import { UserContext } from '../../../Client';
import { Parliament } from '../../../entity/shared/Parliament';
export declare function getParliamentInfo(user: UserContext, capitalId: number, isAutonomy?: boolean): Promise<typeof Parliament | null>;
