import { Player } from './Player';
import { Region } from './Region';
export declare const factoryIds: {
    gold: number;
    oil: number;
    ore: number;
    uranium: number;
    diamonds: number;
    liquidOxygen: number;
    helium3: number;
};
export declare const resCoef: {
    gold: number;
    oil: number;
    ore: number;
    uranium: number;
    diamonds: number;
    liquidOxygen: number;
    helium3: number;
};
export declare const resBalancers: {
    gold: number;
    oil: number;
    ore: number;
    uranium: number;
    diamonds: number;
    liquidOxygen: number;
    helium3: number;
};
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
    type_: keyof typeof factoryIds;
    constructor(id_: number);
    setOwner(player: Player): void;
    setRegion(region: Region): void;
    setWage(wage: string): void;
    production(playerLevel?: number, deep?: number, workExp?: number): number;
    wage(playerLevel?: number, deepResource?: number, workExp?: number): number;
    get type(): string;
    set type(theType: string);
    toJSON(): {
        id: number;
        name: string;
        level: number;
        owner: number;
        region: number;
        wage: (playerLevel?: number, deepResource?: number, workExp?: number) => number;
        isFixed: boolean;
        potentialWage: number;
        type: string;
    };
    static [Symbol.hasInstance](instance: any): boolean;
}
//# sourceMappingURL=Factory.d.ts.map