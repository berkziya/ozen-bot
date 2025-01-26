import { Autonomy } from '../Autonomy';
import { Player } from '../Player';
import { State } from '../State';
export declare class Storage {
    constructor();
    owner: Player | State | Autonomy | null;
    subStorages: Storage[];
    stateMoney: number;
    stateGold: number;
    stateOil: number;
    stateOre: number;
    stateUranium: number;
    stateDiamonds: number;
    money: number;
    gold: number;
    oil: number;
    ore: number;
    uranium: number;
    diamonds: number;
    liquidOxygen: number;
    helium3: number;
    rivalium: number;
    antirad: number;
    energyDrink: number;
    spaceRockets: number;
    lss: number;
    tanks: number;
    aircrafts: number;
    missiles: number;
    bombers: number;
    battleships: number;
    laserDrones: number;
    moonTanks: number;
    spaceStations: number;
    setOwner(owner: Player | State | Autonomy): void;
    setBudgetFromDiv(div: any): Promise<void>;
    toJSON(): {
        subStorages: Storage[];
        owner: number | undefined;
        stateMoney: number;
        stateGold: number;
        stateOil: number;
        stateOre: number;
        stateUranium: number;
        stateDiamonds: number;
        money: number;
        gold: number;
        oil: number;
        ore: number;
        uranium: number;
        diamonds: number;
        liquidOxygen: number;
        helium3: number;
        rivalium: number;
        antirad: number;
        energyDrink: number;
        spaceRockets: number;
        lss: number;
        tanks: number;
        aircrafts: number;
        missiles: number;
        bombers: number;
        battleships: number;
        laserDrones: number;
        moonTanks: number;
        spaceStations: number;
    };
}
