import { Region } from '../../../entity/Region';
import { State } from '../../../entity/State';
import { UserContext } from '../../../UserContext';
export declare function getCitizens(user: UserContext, location: Region | State): Promise<{
    id: number;
    name: string;
    level: number;
    damage: number;
}[]>;
export declare function getResidents(user: UserContext, location: Region | State): Promise<{
    id: number;
    name: string;
    level: number;
    damage: number;
}[]>;
export declare function getWarDamageList(user: UserContext, id: number, defender: boolean): Promise<{
    id: number;
    name: string;
    level: number;
    damage: number;
}[]>;
