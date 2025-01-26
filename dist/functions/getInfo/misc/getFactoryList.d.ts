import { Factory, factoryIds } from '../../../entity/Factory';
import { Region } from '../../../entity/Region';
import { State } from '../../../entity/State';
export declare function getFactoryList(location: State | Region, resource?: keyof typeof factoryIds): Promise<Factory[]>;
export declare function getBestFactory(location: State | Region, resource?: keyof typeof factoryIds, fixedOK?: boolean): Promise<Factory>;
