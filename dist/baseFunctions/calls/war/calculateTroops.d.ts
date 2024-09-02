import { Player } from '../../../entity/Player';
import { War } from '../../../entity/War';
export declare function calculateTroops(player: Player, energy: number | undefined, war: War, drones?: boolean): {
    [key: string]: number;
};
