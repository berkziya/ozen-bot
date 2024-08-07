import { UserContext } from '../../Client';
export declare function getFactoryInfo(user: UserContext, factoryId: number, force?: boolean): Promise<import("../../entity/Factory").Factory | null>;
