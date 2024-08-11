import { Player } from './Player';
import { Region } from './Region';
export declare class War {
    lastUpdate: Date;
    id: number;
    name: string;
    type: 'troopers' | 'sea' | 'training' | 'revolution' | 'coup' | 'ground';
    endingTime: Date | null;
    aggressor: Region;
    defender: Region;
    aggressorDamage: number;
    defenderDamage: number;
    aggresorPlayers: Map<Player, number>;
    defenderPlayers: Map<Player, number>;
    constructor(id_: number);
}
