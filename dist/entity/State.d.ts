import { Player } from './Player';
import { Region } from './Region';
import { Autonomy } from './Autonomy';
export declare class State {
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
}
