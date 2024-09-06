import { Factory, factoryIds } from '../../../entity/Factory';
import { Region } from '../../../entity/Region';
import { State } from '../../../entity/State';
import { User } from '../../../User';
export declare function getFactoryList(user: User, location: State | Region, resource?: keyof typeof factoryIds): Promise<Factory[] | null>;
