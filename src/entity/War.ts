import { Player } from './Player';
import { Region } from './Region';

export class War {
  lastUpdate: Date = new Date(0);

  id: number;
  name: string;

  type!: 'troopers' | 'sea' | 'training' | 'revolution' | 'coup' | 'ground';

  endingTime!: Date | null;

  aggressor!: Region | 'revolution' | 'coup';
  defender!: Region;

  aggressorDamage: number = 0;
  defenderDamage: number = 0;

  aggresorPlayers: Map<Player, number> = new Map();
  defenderPlayers: Map<Player, number> = new Map();

  constructor(id_: number) {
    this.id = id_;
    this.name = 'war/' + this.id.toString();
  }
}
