import { Factory } from '../../../entity/Factory';
import { UserContext } from '../../../UserContext';
export declare function assignToFactory(user: UserContext, factory: Factory): Promise<unknown>;
export declare function cancelAutoWork(user: UserContext): Promise<unknown>;
export declare function autoWork(user: UserContext, factory: Factory): Promise<unknown>;
