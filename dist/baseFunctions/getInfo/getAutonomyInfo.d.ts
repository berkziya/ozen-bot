import { UserContext } from '../../Client';
export declare function getAutonomyInfo(user: UserContext, autonomyId: number, force?: boolean): Promise<import("../../entity/Region").Region | import("../../entity/Autonomy").Autonomy | null>;
