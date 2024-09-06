import { War } from '../../../entity/War';
import { User } from '../../../User';
export declare function getWarList(user: User, stateId: number): Promise<War[] | null>;
