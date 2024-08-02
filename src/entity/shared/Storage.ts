import { Autonomy } from '../Autonomy';
import { Player } from '../Player';
import { State } from '../State';

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
}
