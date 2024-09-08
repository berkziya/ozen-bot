import { Factory } from '../../../entity/Factory';
import { User } from '../../../User';
export declare function assignToFactory(user: User, factory: Factory): Promise<Response>;
export declare function cancelAutoWork(user: User): Promise<Response>;
export declare function autoWork(user: User, factory: Factory): Promise<Response>;