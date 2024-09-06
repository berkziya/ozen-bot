import { Player } from './Player';
import { Region } from './Region';
import { Autonomy } from './Autonomy';
import { Storage } from './shared/Storage';
import { Bloc } from './Bloc';
import { toCamelCase } from '../misc/utils';

export class State {
  lastUpdate: Date = new Date(0);
  id: number;

  name: string;

  capital?: Region;
  regions: Set<Region>;
  autonomies: Set<Autonomy>;

  governmentForm: string = 'dictatorship';

  leader: Player | null = null;
  leaderIsCommander: boolean = false;

  econMinister: Player | null = null;
  foreignMinister: Player | null = null;

  leaderTermStart: Date | null = null;

  entryFee: number = 0;
  bordersOpen: boolean = false;
  needResidencyToWork: boolean = false;
  residencyIssuedByLeader: boolean = false;

  storage: Storage = new Storage();
  bloc: Bloc | null = null;

  // permits: Set<Player>;

  constructor(id_: number) {
    this.id = id_;
    this.name = 'state/' + this.id.toString();
    this.regions = new Set();
    this.autonomies = new Set();
    // this.permits = new Set();
    this.storage.setOwner(this);
  }

  setCapital(region: Region) {
    if (region.state) {
      region.state.regions.delete(region);
    }
    this.regions.add(region);
    this.capital = region;
    region.state = this;
    region.autonomy = null;
  }

  addRegion(region: Region) {
    if (region.state) {
      region.state.regions.delete(region);
    }
    this.regions.add(region);
    region.state = this;
  }

  removeRegion(region: Region) {
    this.regions.delete(region);
    if (region.state === this) {
      region.state = null;
    }
  }

  addAutonomy(autonomy: Autonomy) {
    if (autonomy.state) {
      autonomy.state.autonomies.delete(autonomy);
    }
    this.autonomies.add(autonomy);
    autonomy.state = this;
  }

  setgovernmentForm(form: string) {
    this.governmentForm = toCamelCase(form);
  }

  setLeader(player: Player | null) {
    if (this.leader && this.leader.leaderOfState === this) {
      this.leader.leaderOfState = null;
    }

    this.leader = player;
    if (player) {
      player.leaderOfState = this;
      player.econMinisterOfState = null;
      player.foreignMinisterOfState = null;
    }
  }

  setEconMinister(player: Player | null) {
    if (this.econMinister && this.econMinister.econMinisterOfState === this) {
      this.econMinister.econMinisterOfState = null;
    }

    this.econMinister = player;
    if (player) {
      player.econMinisterOfState = this;
      player.leaderOfState = null;
      player.foreignMinisterOfState = null;
    }
  }

  setForeignMinister(player: Player | null) {
    if (
      this.foreignMinister &&
      this.foreignMinister.foreignMinisterOfState === this
    ) {
      this.foreignMinister.foreignMinisterOfState = null;
    }

    this.foreignMinister = player;
    if (player) {
      player.foreignMinisterOfState = this;
      player.econMinisterOfState = null;
      player.leaderOfState = null;
    }
  }

  toJSON() {
    return {
      lastUpdate: this.lastUpdate,
      id: this.id,
      name: this.name,
      capital: this.capital?.id,
      regions: Array.from(this.regions, (region) => region.id),
      autonomies: Array.from(this.autonomies, (autonomy) => autonomy.id),
      entryFee: this.entryFee,
      bordersOpen: this.bordersOpen,
      needResidencyToWork: this.needResidencyToWork,
      residencyIssuedByLeader: this.residencyIssuedByLeader,
      governmentForm: this.governmentForm,
      leader: this.leader?.id,
      leaderIsCommander: this.leaderIsCommander,
      econMinister: this.econMinister?.id,
      foreignMinister: this.foreignMinister?.id,
      leaderTermStart: this.leaderTermStart,
      storage: this.storage.toJSON(),
      bloc: this.bloc?.id,
    };
  }

  static [Symbol.hasInstance](instance: any): boolean {
    return (
      instance && typeof instance === 'object' && 'governmentForm' in instance
    );
  }
}
