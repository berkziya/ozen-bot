import { Region } from '../../../entity/Region';
import { State } from '../../../entity/State';
import { User } from '../../../User';
export declare function getCitizens(location: Region | State): Promise<{
    id: number;
    name: string;
    level: number;
    damage: number;
}[]>;
export declare function getResidents(user: User, location: Region | State): Promise<{
    id: number;
    name: string;
    level: number;
    damage: number;
}[]>;
export declare function getWarDamageList(user: User, id: number, defender: boolean): Promise<{
    id: number;
    name: string;
    level: number;
    damage: number;
}[]>;
