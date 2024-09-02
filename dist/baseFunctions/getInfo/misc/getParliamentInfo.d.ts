import { UserContext } from '../../../UserContext';
import { Parliament } from '../../../entity/shared/Parliament';
import { Region } from '../../../entity/Region';
export declare function getParliamentInfo(user: UserContext, capital: Region, isAutonomy?: boolean): Promise<Parliament | null>;
