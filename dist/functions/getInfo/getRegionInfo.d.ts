import { Autonomy } from '../../entity/Autonomy';
import { Region } from '../../entity/Region';
import { User } from '../../user/User';
export declare function getRegionInfo(regionId: number, force?: boolean): Promise<Region>;
export declare function getRegionInfoInner(user: User, regionId: number, getAutonomy?: boolean): Promise<Autonomy | Region | null>;
