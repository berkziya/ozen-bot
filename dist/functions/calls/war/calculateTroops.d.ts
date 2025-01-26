import { Player } from '../../../entity/Player';
import { War } from '../../../entity/War';
export declare const TROOPS_FOR_WAR_TYPES: {
    [key: string]: string[];
};
export declare function calculateTroops(player: Player, energy: number | undefined, war: War, drones?: boolean): {
    [key: string]: number;
};
