import { Player } from './Player';
import { Region } from './Region';

export class Party {
  lastUpdate: number = 0;

  id: number;

  name: string;

  region?: Region;

  leader?: Player;

  secretaries: Player[];

  members: Player[];

  constructor(id_: number) {
    this.id = id_;
    this.name = 'party/' + this.id.toString();
    this.secretaries = [];
    this.members = [];
  }

  toJSON() {
    return {
      lastUpdate: this.lastUpdate,
      id: this.id,
      name: this.name,
      region: this.region,
      leader: this.leader,
      secretaries: this.secretaries,
      members: this.members,
    };
  }
}
