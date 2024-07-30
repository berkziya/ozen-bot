import { Player } from './Player';
import { Region } from './Region';
import { State } from './State';
import { Storage } from './shared/Storage';
export declare class Autonomy {
    lastUpdate: number;
    id: number;
    name: string;
    state?: State;
    capital?: Region;
    regions: Region[];
    governor: Player | null;
    storage: Storage;
    constructor(id_: number);
    toJSON(): {
        lastUpdate: number;
        id: number;
        name: string;
        state: State | undefined;
        capital: Region | undefined;
        regions: Region[];
        governor: Player | null;
    };
}
