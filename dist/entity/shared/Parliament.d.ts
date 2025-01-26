import { Player } from '../Player';
import { Region } from '../Region';
export declare class Law {
    id: number;
    by: Player;
    text: string;
    proposeDate: Date | null;
    pro: Set<Player>;
    contra: Set<Player>;
    toJSON(): {
        id: number;
        by: number;
        text: string;
        proposeDate: Date;
        pro: number[];
        contra: number[];
    };
}
export declare class Parliament {
    capitalRegion: Region;
    isAutonomy: boolean;
    laws: Law[];
    toJSON(): {
        capitalRegion: number;
        isAutonomy: boolean;
        laws: Law[];
    };
}
