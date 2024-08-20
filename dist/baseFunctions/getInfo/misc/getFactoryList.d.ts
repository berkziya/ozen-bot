import { Factory, resourceToId } from '../../../entity/Factory';
import { UserContext } from '../../../UserContext';
export declare function getFactoryList(user: UserContext, locationId: number, isState?: boolean, resource?: keyof typeof resourceToId): Promise<Set<Factory> | null>;
