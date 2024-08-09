import { UserContext } from '../../UserContext';
import { Autonomy } from '../../entity/Autonomy';
import { Region } from '../../entity/Region';
export declare function getRegionInfo(user: UserContext, regionId: number, force?: boolean): Promise<Region | null>;
export declare function getRegionInfoInner(user: UserContext, regionId: number, getAutonomy?: boolean): Promise<Autonomy | Region | null>;
