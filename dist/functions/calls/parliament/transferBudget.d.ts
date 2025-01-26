import { resourceIds } from '.';
import { Autonomy } from '../../../entity/Autonomy';
import { Region } from '../../../entity/Region';
import { State } from '../../../entity/State';
import { User } from '../../../user/User';
export declare function transferBudget(user: User, target: State | Region | Autonomy, resource: keyof typeof resourceIds, amount: number): Promise<boolean | "Failed to get state info" | "Failed to get autonomy info">;
