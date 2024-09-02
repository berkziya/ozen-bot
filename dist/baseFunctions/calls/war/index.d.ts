import { War } from '../../../entity/War';
import { UserContext } from '../../../UserContext';
export declare const TROOP_ADMG: {
    [key: string]: number;
};
export declare function cancel_autoattack(user: UserContext): Promise<Response>;
export declare function attack(user: UserContext, war: War, defend?: boolean, max?: boolean, drones?: boolean): Promise<Response | undefined>;
