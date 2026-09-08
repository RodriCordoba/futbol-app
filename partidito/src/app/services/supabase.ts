import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Player } from '../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  public client: SupabaseClient;

  constructor() {
    this.client = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // Traer lista de jugadores ordenada por puntos
  async getPlayers(): Promise<Player[]> {
    const { data, error } = await this.client
      .from('players')
      .select('*')
      .eq('activo', true)
      .order('puntos_tabla', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Guardar partido y ejecutar la función RPC que calcula puntos y Elo
  async registrarPartido(
    teamAIds: string[],
    teamBIds: string[],
    golesA: number,
    golesB: number
  ) {
    const user = (await this.client.auth.getUser()).data.user;

    // 1. Crear cabecera del partido
    const { data: match, error: matchErr } = await this.client
      .from('matches')
      .insert({
        created_by: user?.id || null,
        estado: 'programado'
      })
      .select()
      .single();

    if (matchErr) throw matchErr;

    // 2. Asociar alineaciones
    const matchPlayers = [
      ...teamAIds.map(id => ({ match_id: match.id, player_id: id, equipo: 'A' })),
      ...teamBIds.map(id => ({ match_id: match.id, player_id: id, equipo: 'B' }))
    ];

    const { error: mpErr } = await this.client.from('match_players').insert(matchPlayers);
    if (mpErr) throw mpErr;

    // 3. Ejecutar el cálculo transaccional de Supabase
    const { error: rpcErr } = await this.client.rpc('finalizar_partido', {
      p_match_id: match.id,
      p_goles_a: golesA,
      p_goles_b: golesB
    });

    if (rpcErr) throw rpcErr;
    return true;
  }
  async getHistorial() {
    const { data, error } = await this.client
      .from('matches')
      .select(`
        id, 
        fecha, 
        goles_equipo_a, 
        goles_equipo_b, 
        match_players ( 
          equipo, 
          players ( nombre, posicion ) 
        )
      `)
      .eq('estado', 'finalizado')
      .order('fecha', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}