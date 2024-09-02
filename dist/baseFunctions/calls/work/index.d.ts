import { Factory } from '../../../entity/Factory';
import { UserContext } from '../../../UserContext';
export declare function assignToFactory(user: UserContext, factory: Factory): Promise<Response>;
export declare function cancelAutoWork(user: UserContext): Promise<Response>;
export declare function autoWork(user: UserContext, factory: Factory): Promise<Response>;
