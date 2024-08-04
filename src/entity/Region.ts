import { State } from './State';
import { Autonomy } from './Autonomy';
import { Player } from './Player';
import { Party } from './Party';
import { Factory } from './Factory';

export class Region {
  lastUpdate: Date = new Date(0);
  id: number;

  name: string;

  state: State | null = null;

  needResidencyToWork: boolean = false;
  taxRate: number = 0;
  marketTaxes: number = 0;

  factoryOutputTaxes: {
    gold: number;
    oil: number;
    ore: number;
    uranium: number;
    diamonds: number;
  } = {
    gold: 0,
    oil: 0,
    ore: 0,
    uranium: 0,
    diamonds: 0,
  };

  autonomy: Autonomy | null = null;
  profitShare: number = 0;

  borderRegions: Set<Region>;
  seaAccess: boolean = false;

  parties: Set<Party>;

  buildings: {
    militaryAcademy: number;
    hospital: number;
    militaryBase: number;
    school: number;
    missileSystem: number;
    seaPort: number;
    powerPlant: number;
    spaceport: number;
    airport: number;
    houseFund: number;
  } = {
    militaryAcademy: 0,
    hospital: 0,
    militaryBase: 0,
    school: 0,
    missileSystem: 0,
    seaPort: 0,
    powerPlant: 0,
    spaceport: 0,
    airport: 0,
    houseFund: 0,
  };

  citizens: Set<Player>;
  residents: Set<Player>;

  factories: Set<Factory>;

  resources: {
    gold: number;
    oil: number;
    ore: number;
    uranium: number;
    diamonds: number;
  } = {
    gold: 0,
    oil: 0,
    ore: 0,
    uranium: 0,
    diamonds: 0,
  };

  constructor(id_: number) {
    this.id = id_;
    this.name = 'region/' + this.id.toString();
    this.citizens = new Set();
    this.residents = new Set();
    this.borderRegions = new Set();
    this.parties = new Set();
    this.factories = new Set();
  }

  powerProduction(): number {
    return this.buildings.powerPlant * 10;
  }

  powerConsumption(): number {
    return (
      (this.buildings.hospital +
        this.buildings.militaryBase +
        this.buildings.school +
        this.buildings.missileSystem +
        this.buildings.seaPort +
        this.buildings.spaceport +
        this.buildings.airport) *
      2
    );
  }

  initialAttack(): number {
    return this.buildings.militaryAcademy * 900_000;
  }

  initialDefense(): number {
    return (
      this.buildings.militaryAcademy * 900_000 +
      this.buildings.hospital * 100_000 +
      this.buildings.militaryBase * 200_000 +
      this.buildings.school * 100_000 +
      this.buildings.missileSystem * 100_000 +
      this.buildings.seaPort * 100_000 +
      this.buildings.powerPlant * 100_000 +
      this.buildings.spaceport * 100_000 +
      this.buildings.airport * 100_000
    );
  }

  setState(state: State) {
    if (this.state) {
      this.state.regions.delete(this);
    }
    this.state = state;
    state.regions.add(this);
  }

  setAutonomy(autonomy: Autonomy) {
    if (this.autonomy) {
      this.autonomy.regions.delete(this);
    }
    this.autonomy = autonomy;
    autonomy.regions.add(this);
  }

  addCitizen(player: Player) {
    if (player.region) {
      player.region.citizens.delete(player);
    }
    this.citizens.add(player);
    player.region = this;
  }

  removeCitizen(player: Player) {
    this.citizens.delete(player);
    if (player.region === this) {
      player.region = undefined;
    }
  }

  addResident(player: Player) {
    if (player.residency) {
      player.residency.residents.delete(player);
    }
    this.residents.add(player);
    player.residency = this;
  }

  removeResident(player: Player) {
    this.residents.delete(player);
    if (player.residency === this) {
      player.residency = undefined;
    }
  }

  addParty(party: Party) {
    this.parties.add(party);
    party.region = this;
  }

  toJSON() {
    return {
      lastUpdate: this.lastUpdate,
      id: this.id,
      name: this.name,
      state: this.state?.id,
      needResidencyToWork: this.needResidencyToWork,
      taxRate: this.taxRate,
      marketTaxes: this.marketTaxes,
      factoryOutputTaxes: this.factoryOutputTaxes,
      autonomy: this.autonomy?.id,
      profitShare: this.profitShare,
      borderRegions: Array.from(this.borderRegions, (region) => region.id),
      buildings: this.buildings,
      seaAccess: this.seaAccess,
      citizens: Array.from(this.citizens, (citizen) => citizen.id),
      residents: Array.from(this.residents, (resident) => resident.id),
      parties: Array.from(this.parties, (party) => party.id),
      resources: this.resources,
    };
  }
}
