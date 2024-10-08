import { Player } from './Player';
import { Region } from './Region';
import { State } from './State';
import { Storage } from './shared/Storage';

export class Autonomy {
  lastUpdate: Date = new Date(0);
  id: number;

  name: string;

  state?: State;

  capital?: Region;
  regions: Set<Region>;

  governor: Player | null;

  storage: Storage = new Storage();

  constructor(id_: number) {
    this.id = id_;
    this.name = 'autonomy/' + this.id.toString();
    this.regions = new Set();
    this.governor = null;
    this.storage.setOwner(this);
  }

  setState(state: State) {
    if (this.state) {
      this.state.autonomies.delete(this);
    }
    this.state = state;
    state.autonomies.add(this);
  }

  setCapital(region: Region) {
    this.capital = region;
    this.addRegion(region);
  }

  setGovernor(player: Player) {
    this.governor = player;
  }

  addRegion(region: Region) {
    this.regions.add(region);
  }

  removeRegion(region: Region) {
    this.regions.delete(region);
  }

  toJSON() {
    return {
      lastUpdate: this.lastUpdate,
      id: this.id,
      name: this.name,
      state: this.state?.id,
      capital: this.capital?.id,
      regions: Array.from(this.regions, (region) => region.id),
      governor: this.governor?.id,
      storage: this.storage,
    };
  }

  static [Symbol.hasInstance](instance: any): boolean {
    return instance && typeof instance === 'object' && 'governor' in instance;
  }
}
