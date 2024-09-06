import { User } from '../../User';
import { Autonomy } from '../../entity/Autonomy';
import { Region } from '../../entity/Region';
export declare function getRegionInfo(user: User, regionId: number, force?: boolean): Promise<Region | null>;
export declare function getRegionInfoInner(user: User, regionId: number, getAutonomy?: boolean): Promise<Autonomy | Region | null>;
