import { Player } from './Player';
import { Region } from './Region';
import { Autonomy } from './Autonomy';
import { Storage } from './shared/Storage';
import { Bloc } from './Bloc';
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
}
