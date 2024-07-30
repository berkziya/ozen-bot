import { Player } from './Player';
import { Region } from './Region';
export declare class Party {
    id: number;
    name: string;
    region?: Region;
    leader?: Player;
    secretaries: Player[];
    members: Player[];
    constructor(id_: number);
    toJSON(): {
        id: number;
        name: string;
        region: Region | undefined;
        leader: Player | undefined;
        secretaries: Player[];
        members: Player[];
    };
}
