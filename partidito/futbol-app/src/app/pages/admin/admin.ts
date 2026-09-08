import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase';
import { MatchmakerService } from '../../services/matchmaker';
import { Player } from '../../models/player.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin.html'
})
export class AdminComponent implements OnInit {
  players = signal<Player[]>([]);
  selectedPlayerIds = new Set<string>();

  teamA = signal<Player[]>([]);
  teamB = signal<Player[]>([]);
  scoreA = signal<number>(0);
  scoreB = signal<number>(0);

  golesA: number = 0;
  golesB: number = 0;
  guardando = signal<boolean>(false);

  constructor(
    private supabase: SupabaseService,
    private matchmaker: MatchmakerService
  ) {}

  async ngOnInit() {
    const list = await this.supabase.getPlayers();
    this.players.set(list);
  }

  toggleSelection(id: string) {
    if (this.selectedPlayerIds.has(id)) {
      this.selectedPlayerIds.delete(id);
    } else {
      this.selectedPlayerIds.add(id);
    }
  }

  generarEquipos() {
    const convocados = this.players().filter(p => this.selectedPlayerIds.has(p.id));
    const res = this.matchmaker.balanceTeams(convocados);
    this.teamA.set(res.teamA);
    this.teamB.set(res.teamB);
    this.scoreA.set(res.scoreA);
    this.scoreB.set(res.scoreB);
  }

  async confirmarResultado() {
    if (this.teamA().length === 0 || this.teamB().length === 0) return;
    this.guardando.set(true);

    try {
      await this.supabase.registrarPartido(
        this.teamA().map(p => p.id),
        this.teamB().map(p => p.id),
        this.golesA,
        this.golesB
      );
      alert('¡Partido guardado con éxito! Puntos y ratings actualizados.');
      this.teamA.set([]);
      this.teamB.set([]);
      this.selectedPlayerIds.clear();
      const list = await this.supabase.getPlayers();
      this.players.set(list);
    } catch (err: any) {
      alert('Error al guardar: ' + err.message);
    } finally {
      this.guardando.set(false);
    }
  }
}