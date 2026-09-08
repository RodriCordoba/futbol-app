export type Position = 'Arquero' | 'Defensor' | 'Mediocampista' | 'Delantero';

export interface Player {
  id: string;
  nombre: string;
  posicion: Position;
  tier_base: number;
  rating_actual: number;
  partidos_jugados: number;
  partidos_ganados: number;
  partidos_empatados: number;
  partidos_perdidos: number;
  puntos_tabla: number;
  activo: boolean;
}

export interface MatchResult {
  match_id: string;
  goles_a: number;
  goles_b: number;
}