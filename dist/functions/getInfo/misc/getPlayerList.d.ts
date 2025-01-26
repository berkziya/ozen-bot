import { Region } from '../../../entity/Region';
import { State } from '../../../entity/State';
import { User } from '../../../user/User';
export declare function getCitizens(location: Region | State): Promise<any[]>;
export declare function getResidents(user: User, location: Region | State): Promise<any[]>;
export declare function getWarDamageList(user: User, id: number, defender: boolean): Promise<any[]>;
