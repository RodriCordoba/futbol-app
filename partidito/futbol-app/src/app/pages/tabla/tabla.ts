import { Component, OnInit, signal } from '@angular/core';
import { SupabaseService } from '../../services/supabase';
import { Player } from '../../models/player.model';

@Component({
  selector: 'app-tabla',
  standalone: true,
  templateUrl: './tabla.html'
})
export class TablaComponent implements OnInit {
  players = signal<Player[]>([]);
  loading = signal<boolean>(true);

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    try {
      const data = await this.supabase.getPlayers();
      this.players.set(data);
    } catch (err) {
      console.error(err);
    } finally {
      this.loading.set(false);
    }
  }
}