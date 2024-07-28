import { Storage } from './shared/Storage';
import { Region } from './Region';
import { State } from './State';
import { Autonomy } from './Autonomy';
import { Party } from './Party';
export declare class Player {
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
    constructor(id_: number);
}
