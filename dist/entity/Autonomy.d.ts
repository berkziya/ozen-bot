import { Player } from './Player';
import { Region } from './Region';
import { State } from './State';
import { Storage } from './shared/Storage';
export declare class Autonomy {
    id: Number;
    name: string;
    state?: State;
    capital?: Region;
    regions: Region[];
    governor: Player | null;
    storage: Storage;
    constructor(id_: Number);
}
