import { Player } from './Player';
import { Region } from './Region';
export declare class Party {
    lastUpdate: Date;
    id: number;
    name: string;
    region?: Region;
    leader?: Player;
    secretaries: Set<Player>;
    members: Set<Player>;
    constructor(id_: number);
    setRegion(region: Region): void;
    setLeader(player: Player): void;
    addSecretary(player: Player): void;
    addMember(player: Player): void;
    removeMember(player: Player): void;
    toJSON(): {
        lastUpdate: Date;
        id: number;
        name: string;
        region: number | undefined;
        leader: number | undefined;
        secretaries: number[];
        members: number[];
    };
}
