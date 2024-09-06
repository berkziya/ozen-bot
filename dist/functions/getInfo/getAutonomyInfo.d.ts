import { User } from '../../User';
export declare function getAutonomyInfo(user: User, autonomyId: number, force?: boolean): Promise<import("../../entity/Region").Region | import("../../entity/Autonomy").Autonomy | null>;
