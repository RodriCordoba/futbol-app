import { Injectable } from '@angular/core';
import { Player } from '../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class MatchmakerService {
  balanceTeams(selectedPlayers: Player[]) {
    const arqueros = selectedPlayers.filter(p => p.posicion === 'Arquero');
    const campo = selectedPlayers.filter(p => p.posicion !== 'Arquero');

    // Ordenar jugadores de campo por rating descendente
    campo.sort((a, b) => b.rating_actual - a.rating_actual);

    const teamA: Player[] = [];
    const teamB: Player[] = [];

    // Distribuir los 2 arqueros
    if (arqueros.length >= 2) {
      // El arquero con mayor rating va al equipo A
      arqueros.sort((a, b) => b.rating_actual - a.rating_actual);
      teamA.push(arqueros[0]);
      teamB.push(arqueros[1]);
    } else {
      arqueros.forEach((arq, i) => (i % 2 === 0 ? teamA.push(arq) : teamB.push(arq)));
    }

    // Snake Draft para jugadores de campo (minimiza la brecha de habilidad)
    campo.forEach((jugador, index) => {
      const ronda = Math.floor(index / 2);
      if (ronda % 2 === 0) {
        index % 2 === 0 ? teamA.push(jugador) : teamB.push(jugador);
      } else {
        index % 2 === 0 ? teamB.push(jugador) : teamA.push(jugador);
      }
    });

    const scoreA = teamA.reduce((sum, p) => sum + Number(p.rating_actual), 0);
    const scoreB = teamB.reduce((sum, p) => sum + Number(p.rating_actual), 0);

    return {
      teamA,
      teamB,
      scoreA: Math.round(scoreA),
      scoreB: Math.round(scoreB)
    };
  }
}