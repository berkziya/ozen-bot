import { Player } from './Player';
import { Region } from './Region';
import { Autonomy } from './Autonomy';
export declare class State {
    lastUpdate: number;
    id: number;
    name: string;
    regions: Region[];
    autonomies: Autonomy[];
    governmentForm: string;
    leader: Player | null;
    leaderIsCommander: boolean;
    econMinister: Player | null;
    foreignMinister: Player | null;
    leaderTermStart: Date | null;
    constructor(id_: number);
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
