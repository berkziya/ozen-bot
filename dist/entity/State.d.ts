import { Player } from './Player';
import { Region } from './Region';
import { Autonomy } from './Autonomy';
export declare class State {
    lastUpdate: number;
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
        lastUpdate: number;
        id: number;
        name: string;
        regions: number[];
        autonomies: number[];
        governmentForm: string;
        leader: number | undefined;
        leaderIsCommander: boolean;
        econMinister: number | undefined;
        foreignMinister: number | undefined;
        leaderTermStart: Date | null;
    };
}
