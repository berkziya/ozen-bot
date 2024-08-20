import { War } from '../../../entity/War';
import { UserContext } from '../../../UserContext';
export declare function getWarList(user: UserContext, stateId: number): Promise<Set<War> | null>;
