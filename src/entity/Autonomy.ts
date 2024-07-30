import { Player } from './Player';
import { Region } from './Region';
import { State } from './State';
import { Storage } from './shared/Storage';

export class Autonomy {
  lastUpdate: number = 0;

  id: number;

  name: string;

  state?: State;

  capital?: Region;

  regions: Region[];

  governor: Player | null;

  storage: Storage = new Storage();

  constructor(id_: number) {
    this.id = id_;
    this.name = 'autonomy/' + this.id.toString();
    this.regions = [];
    this.governor = null;
  }

  toJSON() {
    return {
      lastUpdate: this.lastUpdate,
      id: this.id,
      name: this.name,
      state: this.state,
      capital: this.capital,
      regions: this.regions,
      governor: this.governor,
    };
  }
}
