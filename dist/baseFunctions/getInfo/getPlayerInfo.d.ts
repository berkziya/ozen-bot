import { User } from '../../User';
export declare function getPlayerInfo(user: User, playerId?: number, force?: boolean): Promise<import("../../entity/Player").Player | null>;
