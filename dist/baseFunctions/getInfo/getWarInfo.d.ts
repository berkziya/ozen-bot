import { UserContext } from '../../UserContext';
export declare function getWarInfo(user: UserContext, warId: number, force?: boolean): Promise<import("../../entity/War").War | null>;
