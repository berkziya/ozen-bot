import { Autonomy } from '../Autonomy';
import { Player } from '../Player';
import { State } from '../State';

export class Storage {
  owner: Player | State | Autonomy | null = null;
  subStorage: Storage[] = [];

  public stateMoney = 0;
  public stateGold = 0;
  public stateOil = 0;
  public stateOre = 0;
  public stateUranium = 0;
  public stateDiamonds = 0;

  public money = 0;
  public gold = 0;
  public oil = 0;
  public ore = 0;
  public uranium = 0;
  public diamonds = 0;
  public liquidOxygen = 0;
  public helium3 = 0;
  public rivalium = 0;

  public antirad = 0;
  public energyDrink = 0;
  public spaceRockets = 0;
  public lss = 0;

  public tanks = 0;
  public aircrafts = 0;
  public missiles = 0;
  public bombers = 0;
  public battleships = 0;
  public laserDrones = 0;
  public moonTanks = 0;
  public spaceStations = 0;
}
