import { UserContext } from '../../../UserContext';
export declare function getCitizenList(user: UserContext, id: number): Promise<{
    id: number;
    name: string;
    level: number;
    damage: number;
}[]>;
export declare function getResidentList(user: UserContext, id: number): Promise<{
    id: number;
    name: string;
    level: number;
    damage: number;
}[]>;
export declare function getStateCitizens(user: UserContext, id: number): Promise<{
    id: number;
    name: string;
    level: number;
    damage: number;
}[]>;
export declare function getStateResidents(user: UserContext, id: number): Promise<{
    id: number;
    name: string;
    level: number;
    damage: number;
}[]>;
export declare function getWarDamageList(user: UserContext, id: number, aggressor: boolean): Promise<{
    id: number;
    name: string;
    level: number;
    damage: number;
}[]>;
