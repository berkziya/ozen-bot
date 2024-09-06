import { User } from '../../../User';
import { Parliament } from '../../../entity/shared/Parliament';
import { Region } from '../../../entity/Region';
export declare function getParliamentInfo(user: User, capital: Region, isAutonomy?: boolean): Promise<Parliament | null>;
