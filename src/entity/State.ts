import { Player } from './Player';
import { Region } from './Region';
import { Autonomy } from './Autonomy';

export class State {
  lastUpdate: number = 0;

  id: number;

  name: string;

  regions: Region[];

  autonomies: Autonomy[];

  governmentForm: string = 'Dictatorship';

  leader: Player | null = null;

  leaderIsCommander: boolean = false;

  econMinister: Player | null = null;

  foreignMinister: Player | null = null;

  leaderTermStart: Date | null = null;

  constructor(id_: number) {
    this.id = id_;
    this.name = 'state/' + this.id.toString();
    this.regions = [];
    this.autonomies = [];
  }

  toJSON() {
    return {
      lastUpdate: this.lastUpdate,
      id: this.id,
      name: this.name,
      regions: this.regions.map((region) => region.id),
      autonomies: this.autonomies.map((autonomy) => autonomy.id),
      governmentForm: this.governmentForm,
      leader: this.leader?.id,
      leaderIsCommander: this.leaderIsCommander,
      econMinister: this.econMinister?.id,
      foreignMinister: this.foreignMinister?.id,
      leaderTermStart: this.leaderTermStart,
    };
  }
}
