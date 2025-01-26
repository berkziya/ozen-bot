import { Player } from './Player';
import { Region } from './Region';
import { State } from './State';
import { Storage } from './shared/Storage';
export declare class Autonomy {
    lastUpdate: Date;
    id: number;
    name: string;
    state?: State;
    capital?: Region;
    regions: Set<Region>;
    governor: Player | null;
    storage: Storage;
    constructor(id_: number);
    setState(state: State): void;
    setCapital(region: Region): void;
    setGovernor(player: Player): void;
    addRegion(region: Region): void;
    removeRegion(region: Region): void;
    toJSON(): {
        lastUpdate: Date;
        id: number;
        name: string;
        state: number;
        capital: number;
        regions: number[];
        governor: number;
        storage: Storage;
    };
    static [Symbol.hasInstance](instance: any): boolean;
}
