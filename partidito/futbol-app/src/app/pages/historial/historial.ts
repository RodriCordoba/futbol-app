import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './historial.html'
})
export class HistorialComponent implements OnInit {
  partidos = signal<any[]>([]);
  loading = signal<boolean>(true);

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    try {
      const data = await this.supabase.getHistorial();
      
      // Mapear los datos para separar Equipo A y Equipo B fácilmente en el HTML
      const partidosMapeados = data.map(p => ({
        ...p,
        equipoA: p.match_players.filter((mp: any) => mp.equipo === 'A').map((mp: any) => mp.players),
        equipoB: p.match_players.filter((mp: any) => mp.equipo === 'B').map((mp: any) => mp.players)
      }));

      this.partidos.set(partidosMapeados);
    } catch (err) {
      console.error(err);
    } finally {
      this.loading.set(false);
    }
  }
}