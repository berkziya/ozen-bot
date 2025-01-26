import { User } from '../../../user/User';
export declare const DEPT_IDS: {
    buildings: number;
    gold: number;
    oil: number;
    ore: number;
    diamonds: number;
    uranium: number;
    liquidOxygen: number;
    helium3: number;
    tanks: number;
    spaceStations: number;
    battleships: number;
};
export declare function workStateDept(user: User, dept?: keyof typeof DEPT_IDS): Promise<Response>;
