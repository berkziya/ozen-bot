import { UserContext } from '../../../UserContext';
import { Region } from '../../../entity/Region';
import { State } from '../../../entity/State';
import { Law } from '../../../entity/shared/Parliament';
import { Autonomy } from '../../../entity/Autonomy';
export declare function proLaw(user: UserContext, capitalId: number, law: Law): Promise<void>;
export declare function cancelSelfLaw(user: UserContext): Promise<void>;
export declare function transferBudget(user: UserContext, to: State | Region | Autonomy, resource: string, amount: number): Promise<true | "You don't have permission to transfer budget" | "Failed to get state info" | "Failed to get autonomy info">;
