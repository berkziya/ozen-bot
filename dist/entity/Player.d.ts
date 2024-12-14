import { Autonomy } from "./Autonomy";
import { Factory } from "./Factory";
import { Party } from "./Party";
import { Region } from "./Region";
import { Storage } from "./shared/Storage";
import { State } from "./State";
export declare class Player {
    lastUpdate: Date;
    id: number;
    name: string;
    level: number;
    exp: number;
    perks: {
        str: number;
        edu: number;
        end: number;
    };
    region?: Region;
    residency?: Region;
    homelandBonus: State | null;
    leaderOfState: State | null;
    econMinisterOfState: State | null;
    foreignMinisterOfState: State | null;
    governorOfAuto: Autonomy | null;
    party: Party | null;
    storage: Storage;
    factories: Set<Factory>;
    statePermits: Set<State>;
    regionPermits: Set<Region>;
    constructor(id_: number);
    get totalGold(): number;
    alpha(energy?: number): number;
    setName(name: string): void;
    setRegion(region: Region): void;
    setResidency(region: Region): void;
    setParty(party: Party): void;
    setHomelandBonus(state: State): void;
    setLeader(state: State): void;
    setEcon(state: State): void;
    setForeign(state: State): void;
    setGovernor(autonomy: Autonomy): void;
    addFactory(factory: Factory): void;
    addStatePermit(state: State): void;
    addRegionPermit(region: Region): void;
    toJSON(): {
        lastUpdate: Date;
        id: number;
        name: string;
        level: number;
        exp: number;
        perks: {
            str: number;
            edu: number;
            end: number;
        };
        region: number | undefined;
        residency: number | undefined;
        homelandBonus: number | undefined;
        leaderOfState: number | undefined;
        econMinisterOfState: number | undefined;
        foreignMinisterOfState: number | undefined;
        governorOfAuto: number | undefined;
        party: number | undefined;
        storage: Storage;
        factories: number[];
        statePermits: number[];
        regionPermits: number[];
    };
    static [Symbol.hasInstance](instance: any): boolean;
}
