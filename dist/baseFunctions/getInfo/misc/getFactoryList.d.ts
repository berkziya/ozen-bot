import { Factory } from '../../../entity/Factory';
import { UserContext } from '../../../UserContext';
declare const resourceToId: {
    gold: number;
    oil: number;
    ore: number;
    uranium: number;
    diamonds: number;
    liquidOxygen: number;
    helium3: number;
};
export declare function getFactoryList(user: UserContext, locationId: number, isState?: boolean, resource?: keyof typeof resourceToId): Promise<Set<Factory> | null>;
export {};
