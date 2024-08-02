import { Player } from './Player';
import { Region } from './Region';
export declare class Factory {
    lastUpdate: Date;
    id: number;
    name: string;
    owner?: Player;
    region?: Region;
    constructor(id_: number);
    setOwner(player: Player): void;
    setRegion(region: Region): void;
}
