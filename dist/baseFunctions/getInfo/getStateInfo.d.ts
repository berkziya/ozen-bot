import { UserContext } from '../../Client';
export declare function getStateInfo(user: UserContext, stateId: number, force?: boolean): Promise<import("../../entity/State").State | null>;
