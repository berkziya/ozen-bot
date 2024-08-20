import { Autonomy } from '../../../entity/Autonomy';
import { Region } from '../../../entity/Region';
import { State } from '../../../entity/State';
import { UserContext } from '../../../UserContext';
export declare function transferBudget(user: UserContext, to: State | Region | Autonomy, resource: string, amount: number): Promise<true | "You don't have permission to transfer budget" | "Failed to get state info" | "Failed to get autonomy info" | null>;
