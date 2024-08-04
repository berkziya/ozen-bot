import { Player } from '../Player';
import { Region } from '../Region';
export declare class Law {
    id: number;
    by: Player | null;
    text: string;
    proposedAt: Date | null;
    pro: Set<Player>;
    contra: Set<Player>;
}
export declare class Parliament {
    capitalRegion: Region | null;
    isAutonomy: boolean;
    laws: Law[];
}
