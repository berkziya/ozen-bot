import { User } from '../../../user/User';
declare const deptIds: {
    buildings: string;
    gold: string;
    oil: string;
    ore: string;
    diamonds: string;
    uranium: string;
    liquidOxygen: string;
    helium3: string;
    tanks: string;
    spaceStations: string;
    battleships: string;
};
export declare function workStateDept(user: User, dept?: keyof typeof deptIds): Promise<Response>;
export {};
