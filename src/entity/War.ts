import { Player } from './Player';
import { Region } from './Region';

export class War {
  lastUpdate: Date = new Date(0);

  id: number;
  name: string;

  type!:
    | 'troopers'
    | 'sea'
    | 'training'
    | 'revolution'
    | 'coup'
    | 'ground'
    | 'space'
    | 'moon';

  endingTime!: Date | null;

  aggressor!: Region;
  defender!: Region;

  aggressorDamage = 0;
  defenderDamage = 0;

  aggresorPlayers: Map<Player, number> = new Map();
  defenderPlayers: Map<Player, number> = new Map();

  constructor(id_: number) {
    this.id = id_;
    this.name = 'war/' + this.id.toString();
  }

  toJSON() {
    return {
      lastUpdate: this.lastUpdate,
      id: this.id,
      name: this.name,
      type: this.type,
      endingTime: this.endingTime,
      aggresor: this.aggressor.id,
      defender: this.defender.id,
      aggressorDamage: this.aggressorDamage,
      defenderDamage: this.defenderDamage,
      aggresorPlayers: Array.from(this.aggresorPlayers, ([player, damage]) => {
        return { player: player.id, damage };
      }),
      defenderPlayers: Array.from(this.defenderPlayers, ([player, damage]) => {
        return { player: player.id, damage };
      }),
    };
  }

  static [Symbol.hasInstance](instance: any): boolean {
    return (
      instance && typeof instance === 'object' && 'aggressorDamage' in instance
    );
  }
}
