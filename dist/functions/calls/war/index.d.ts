import { War } from '../../../entity/War';
import { User } from '../../../user/User';
export { calculateTroops, TROOPS_FOR_WAR_TYPES } from './calculateTroops';
export { calculateDamage } from './calculateDamage';
export declare const TROOP_ALPHA_DAMAGE: {
    [key: string]: number;
};
export declare function cancelAutoAttack(user: User): Promise<Response>;
export declare function attack(user: User, war: War, defend?: boolean, max?: boolean, drones?: boolean): Promise<Response>;
//# sourceMappingURL=index.d.ts.map