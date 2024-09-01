import { Player } from '../Player';
import { Region } from '../Region';
export declare class Law {
    id: number;
    by: Player;
    text: string;
    proposeDate: Date | null;
    pro: Set<Player>;
    contra: Set<Player>;
}
export declare class Parliament {
    capitalRegion: Region;
    isAutonomy: boolean;
    laws: Law[];
}
