import { Autonomy } from '../../../entity/Autonomy';
import { Region } from '../../../entity/Region';
import { State } from '../../../entity/State';
import { UserContext } from '../../../UserContext';
declare const resourceIds: {
    money: number;
    gold: number;
    oil: number;
    ore: number;
    uranium: number;
    diamonds: number;
};
export declare function transferBudget(user: UserContext, to: State | Region | Autonomy, resource: keyof typeof resourceIds, amount: number): Promise<boolean | "You don't have permission to transfer budget" | "Failed to get state info" | "Failed to get autonomy info" | null>;
export {};
