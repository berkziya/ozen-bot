import { Storage } from './shared/Storage';
import { Region } from './Region';
import { State } from './State';
import { Autonomy } from './Autonomy';
import { Party } from './Party';

export class Player {
  lastUpdate: number = 0;

  id: number;

  name: string;

  level: number = 30;

  exp: number = 0;

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

  statePermits: State[] = [];
  regionPermits: Region[] = [];

  constructor(id_: number) {
    this.id = id_;
    this.name = 'player/' + this.id.toString();
    this.homelandBonus = null;
    this.leaderOfState = null;
    this.econMinisterOfState = null;
    this.foreignMinisterOfState = null;
    this.governorOfAuto = null;
    this.party = null;
  }

  public setName(name: string) {
    const havePartyTag = name.match(/\[[^\]]{1,3}\]/g);
    if (havePartyTag) {
      this.name = name.replace(havePartyTag[0], '').trim();
    } else {
      this.name = name.trim();
    }
  }

  public setRegion(region: Region) {
    this.region = region;
    region.citizens.push(this);
  }

  public setResidency(region: Region) {
    this.residency = region;
    region.residents.push(this);
  }

  public setLeader(state: State) {
    this.leaderOfState = state;
    state.leader = this;
    this.econMinisterOfState = null;
    this.foreignMinisterOfState = null;
  }

  public setEcon(state: State) {
    this.econMinisterOfState = state;
    state.econMinister = this;
    this.leaderOfState = null;
    this.foreignMinisterOfState = null;
  }

  public setForeign(state: State) {
    this.foreignMinisterOfState = state;
    state.foreignMinister = this;
    this.leaderOfState = null;
    this.econMinisterOfState = null;
  }

  public setGovernor(autonomy: Autonomy) {
    this.governorOfAuto = autonomy;
  }

  public addStatePermit(state: State) {
    if (!this.statePermits.includes(state)) {
      this.statePermits.push(state);
    }
  }

  public removeStatePermit(state: State) {
    this.statePermits = this.statePermits.filter((s) => s !== state);
  }

  public addRegionPermit(region: Region) {
    if (!this.regionPermits.includes(region)) {
      this.regionPermits.push(region);
    }
  }

  public removeRegionPermit(region: Region) {
    this.regionPermits = this.regionPermits.filter((r) => r !== region);
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
      statePermits: this.statePermits.map((state) => state.id),
      regionPermits: this.regionPermits.map((region) => region.id),
    };
  }
}
