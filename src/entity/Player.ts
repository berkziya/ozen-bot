import { Autonomy } from './Autonomy';
import { Factory } from './Factory';
import { Party } from './Party';
import { Region } from './Region';
import { Storage } from './shared/Storage';
import { State } from './State';

export class Player {
  lastUpdate: Date = new Date(0);
  id: number;

  name: string;

  level = 30;
  exp = 0;
  perks: { str: number; edu: number; end: number } = {
    str: 30,
    edu: 30,
    end: 30,
  };

  region?: Region;
  residency?: Region;
  homelandBonus: State | null;

  leaderOfState: State | null;
  econMinisterOfState: State | null;
  foreignMinisterOfState: State | null;
  governorOfAuto: Autonomy | null;

  party: Party | null;

  storage: Storage = new Storage();
  factories: Set<Factory>;

  statePermits: Set<State>;
  regionPermits: Set<Region>;

  constructor(id_: number) {
    this.id = id_;
    this.name = 'player/' + this.id.toString();
    this.homelandBonus = null;
    this.leaderOfState = null;
    this.econMinisterOfState = null;
    this.foreignMinisterOfState = null;
    this.governorOfAuto = null;
    this.party = null;
    this.statePermits = new Set();
    this.regionPermits = new Set();
    this.factories = new Set();
    this.storage.setOwner(this);
  }

  get totalGold() {
    return Math.floor(this.storage.gold + this.storage.energyDrink / 10);
  }

  alpha(energy = 300) {
    const slot = Math.floor(energy / 6);
    return 50 * (this.level + 20) * slot;
  }

  setName(name: string) {
    const havePartyTag = name.match(/\[[^\]]{1,3}\]/g);
    if (havePartyTag) {
      this.name = name.replace(havePartyTag[0], '').trim();
    } else {
      this.name = name.trim();
    }
  }

  setRegion(region: Region) {
    if (this.region) {
      this.region.citizens.delete(this);
    }
    this.region = region;
    region.citizens.add(this);
  }

  setResidency(region: Region) {
    if (this.residency) {
      this.residency.residents.delete(this);
    }
    this.residency = region;
    region.residents.add(this);
  }

  setParty(party: Party) {
    this.party = party;
  }

  setHomelandBonus(state: State) {
    this.homelandBonus = state;
  }

  setLeader(state: State) {
    if (this.leaderOfState && this.leaderOfState.leader === this) {
      this.leaderOfState.leader = null;
    }
    this.leaderOfState = state;
    state.leader = this;
    this.econMinisterOfState = null;
    this.foreignMinisterOfState = null;
  }

  setEcon(state: State) {
    if (
      this.econMinisterOfState &&
      this.econMinisterOfState.econMinister === this
    ) {
      this.econMinisterOfState.econMinister = null;
    }
    this.econMinisterOfState = state;
    state.econMinister = this;
    this.leaderOfState = null;
    this.foreignMinisterOfState = null;
  }

  setForeign(state: State) {
    if (
      this.foreignMinisterOfState &&
      this.foreignMinisterOfState.foreignMinister === this
    ) {
      this.foreignMinisterOfState.foreignMinister = null;
    }
    this.foreignMinisterOfState = state;
    state.foreignMinister = this;
    this.leaderOfState = null;
    this.econMinisterOfState = null;
  }

  setGovernor(autonomy: Autonomy) {
    if (this.governorOfAuto && this.governorOfAuto.governor === this) {
      this.governorOfAuto.governor = null;
    }
    this.governorOfAuto = autonomy;
    autonomy.governor = this;
  }

  addFactory(factory: Factory) {
    this.factories.add(factory);
  }

  addStatePermit(state: State) {
    this.statePermits.add(state);
  }

  addRegionPermit(region: Region) {
    this.regionPermits.add(region);
  }

  toJSON() {
    return {
      lastUpdate: this.lastUpdate,
      id: this.id,
      name: this.name,
      level: this.level,
      exp: this.exp,
      perks: this.perks,
      region: this.region?.id,
      residency: this.residency?.id,
      homelandBonus: this.homelandBonus?.id,
      leaderOfState: this.leaderOfState?.id,
      econMinisterOfState: this.econMinisterOfState?.id,
      foreignMinisterOfState: this.foreignMinisterOfState?.id,
      governorOfAuto: this.governorOfAuto?.id,
      party: this.party?.id,
      storage: this.storage,
      factories: Array.from(this.factories, (factory) => factory.id),
      statePermits: Array.from(this.statePermits, (state) => state.id),
      regionPermits: Array.from(this.regionPermits, (region) => region.id),
    };
  }

  static [Symbol.hasInstance](instance: any): boolean {
    return (
      instance && typeof instance === 'object' && 'homelandBonus' in instance
    );
  }
}
