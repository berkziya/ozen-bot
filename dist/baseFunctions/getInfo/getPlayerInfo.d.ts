import { UserContext } from '../../UserContext';
export declare function getPlayerInfo(user: UserContext, playerId: number, force?: boolean): Promise<import("../../entity/Player").Player | null>;
