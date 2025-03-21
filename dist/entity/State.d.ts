import { Autonomy } from './Autonomy';
import { Bloc } from './Bloc';
import { Player } from './Player';
import { Region } from './Region';
import { Storage } from './shared/Storage';
export declare class State {
    lastUpdate: Date;
    id: number;
    name: string;
    capital?: Region;
    regions: Set<Region>;
    autonomies: Set<Autonomy>;
    governmentForm: string;
    leader: Player | null;
    leaderIsCommander: boolean;
    econMinister: Player | null;
    foreignMinister: Player | null;
    leaderTermStart: Date | null;
    entryFee: number;
    bordersOpen: boolean;
    needResidencyToWork: boolean;
    residencyIssuedByLeader: boolean;
    storage: Storage;
    bloc: Bloc | null;
    constructor(id_: number);
    setCapital(region: Region): void;
    addRegion(region: Region): void;
    removeRegion(region: Region): void;
    addAutonomy(autonomy: Autonomy): void;
    setgovernmentForm(form: string): void;
    setLeader(player: Player | null): void;
    setEconMinister(player: Player | null): void;
    setForeignMinister(player: Player | null): void;
    toJSON(): {
        lastUpdate: Date;
        id: number;
        name: string;
        capital: number | undefined;
        regions: number[];
        autonomies: number[];
        entryFee: number;
        bordersOpen: boolean;
        needResidencyToWork: boolean;
        residencyIssuedByLeader: boolean;
        governmentForm: string;
        leader: number | undefined;
        leaderIsCommander: boolean;
        econMinister: number | undefined;
        foreignMinister: number | undefined;
        leaderTermStart: Date | null;
        storage: {
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
        bloc: number | undefined;
    };
    static [Symbol.hasInstance](instance: any): boolean;
}
//# sourceMappingURL=State.d.ts.map