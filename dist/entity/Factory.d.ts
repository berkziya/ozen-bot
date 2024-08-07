import { Player } from './Player';
import { Region } from './Region';
export declare class Factory {
    lastUpdate: Date;
    id: number;
    name: string;
    level: number;
    owner: Player;
    region: Region;
    wage_: number;
    isFixed: boolean;
    potentialWage: number;
    type_: 'gold' | 'oil' | 'ore' | 'uranium' | 'diamonds' | 'liquidOxygen' | 'helium3';
    constructor(id_: number);
    setOwner(player: Player): void;
    setRegion(region: Region): void;
    setWage(wage: string): void;
    get wage(): number;
    get type(): string;
    set type(theType: string);
    toJSON(): {
        id: number;
        name: string;
        level: number;
        owner: number;
        region: number;
        wage: number;
        isFixed: boolean;
        potentialWage: number;
        type: string;
    };
}
