import { UserContext } from '../../../UserContext';
import { Parliament } from '../../../entity/shared/Parliament';
export declare function getParliamentInfo(user: UserContext, capitalId: number, isAutonomy?: boolean): Promise<Parliament | null>;
