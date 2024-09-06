import { Region } from '../../../entity/Region';
import { Parliament } from '../../../entity/shared/Parliament';
import { User } from '../../../User';
export declare function getParliamentInfo(user: User, capital: Region, isAutonomy?: boolean): Promise<Parliament | null>;
