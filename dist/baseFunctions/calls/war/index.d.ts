import { War } from '../../../entity/War';
import { User } from '../../../User';
export declare const troopAlphaDamage: {
    [key: string]: number;
};
export declare function cancel_autoattack(user: User): Promise<Response>;
export declare function attack(user: User, war: War, defend?: boolean, max?: boolean, drones?: boolean): Promise<Response | undefined>;
