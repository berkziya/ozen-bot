import { Cheerio, Element } from 'cheerio';
import { Autonomy } from '../Autonomy';
import { Player } from '../Player';
import { State } from '../State';
import { dotless } from '../../misc/utils';

export class Storage {
  constructor() {
    this.subStorages = [];
  }

  owner: Player | State | Autonomy | null = null;

  subStorages: Storage[];

  stateMoney = 0;
  stateGold = 0;
  stateOil = 0;
  stateOre = 0;
  stateUranium = 0;
  stateDiamonds = 0;

  money = 0;
  gold = 0;
  oil = 0;
  ore = 0;
  uranium = 0;
  diamonds = 0;
  liquidOxygen = 0;
  helium3 = 0;
  rivalium = 0;

  antirad = 0;
  energyDrink = 0;
  spaceRockets = 0;
  lss = 0;

  tanks = 0;
  aircrafts = 0;
  missiles = 0;
  bombers = 0;
  battleships = 0;
  laserDrones = 0;
  moonTanks = 0;
  spaceStations = 0;

  setOwner(owner: Player | State | Autonomy) {
    this.owner = owner;
  }

  async setBudgetFromDiv(div: Cheerio<Element>) {
    const spans = div.find('span');
    this.stateMoney = dotless(spans.eq(0).text());
    this.stateGold = dotless(spans.eq(1).text());
    this.stateOil = dotless(spans.eq(2).text());
    this.stateOre = dotless(spans.eq(3).text());
    this.stateUranium = dotless(spans.eq(4).text());
    this.stateDiamonds = dotless(spans.eq(5).text());
  }

  toJSON() {
    return {
      subStorages: this.subStorages,
      owner: this.owner?.id,
      stateMoney: this.stateMoney,
      stateGold: this.stateGold,
      stateOil: this.stateOil,
      stateOre: this.stateOre,
      stateUranium: this.stateUranium,
      stateDiamonds: this.stateDiamonds,
      money: this.money,
      gold: this.gold,
      oil: this.oil,
      ore: this.ore,
      uranium: this.uranium,
      diamonds: this.diamonds,
      liquidOxygen: this.liquidOxygen,
      helium3: this.helium3,
      rivalium: this.rivalium,
      antirad: this.antirad,
      energyDrink: this.energyDrink,
      spaceRockets: this.spaceRockets,
      lss: this.lss,
      tanks: this.tanks,
      aircrafts: this.aircrafts,
      missiles: this.missiles,
      bombers: this.bombers,
      battleships: this.battleships,
      laserDrones: this.laserDrones,
      moonTanks: this.moonTanks,
      spaceStations: this.spaceStations,
    };
  }
}
