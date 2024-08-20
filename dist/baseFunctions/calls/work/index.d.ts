import { Factory } from '../../../entity/Factory';
import { UserContext } from '../../../UserContext';
export declare function assignToFactory(user: UserContext, factory: Factory): Promise<void>;
export declare function cancelAutoWork(user: UserContext): Promise<void>;
export declare function autoWork(user: UserContext, factory: Factory): Promise<void>;
