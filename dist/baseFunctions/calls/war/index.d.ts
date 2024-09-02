import { Player } from '../../../entity/Player';
import { War } from '../../../entity/War';
import { UserContext } from '../../../UserContext';
export declare function cancel_autoattack(user: UserContext): Promise<Response>;
export declare function calculate_troops(player: Player, energy: number | undefined, war: War, drones?: boolean): {
    [key: string]: number;
};
export declare function attack(user: UserContext, war: War, agressor?: boolean, max?: boolean, drones?: boolean): Promise<Response | undefined>;
export declare function calculate_damage(player: Player, war: War, agressor?: boolean): number;
