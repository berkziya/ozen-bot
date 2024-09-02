import { Factory, factoryIds } from '../../../entity/Factory';
import { State } from '../../../entity/State';
import { Region } from '../../../entity/Region';
import { UserContext } from '../../../UserContext';
export declare function getFactoryList(user: UserContext, location: State | Region, resource?: keyof typeof factoryIds): Promise<Factory[] | null>;
