import { Autonomy } from './Autonomy';
import { Factory } from './Factory';
import { Party } from './Party';
import { Player } from './Player';
import { State } from './State';
export declare class Region {
    lastUpdate: Date;
    id: number;
    name: string;
    state: State | null;
    needResidencyToWork: boolean;
    taxRate: number;
    marketTaxes: number;
    factoryOutputTaxes: {
        gold: number;
        oil: number;
        ore: number;
        uranium: number;
        diamonds: number;
    };
    autonomy: Autonomy | null;
    profitShare: number;
    borderRegions: Set<Region>;
    seaAccess: boolean;
    parties: Set<Party>;
    buildings: {
        militaryAcademy: number;
        hospital: number;
        militaryBase: number;
        school: number;
        missileSystem: number;
        seaPort: number;
        powerPlant: number;
        spaceport: number;
        airport: number;
        houseFund: number;
    };
    citizens: Set<Player>;
    residents: Set<Player>;
    factories: Set<Factory>;
    resources: {
        gold: number;
        oil: number;
        ore: number;
        uranium: number;
        diamonds: number;
    };
    constructor(id_: number);
    powerProduction(): number;
    powerConsumption(): number;
    initialAttack(): number;
    initialDefense(): number;
    setState(state: State): void;
    setAutonomy(autonomy: Autonomy): void;
    addCitizen(player: Player): void;
    removeCitizen(player: Player): void;
    addResident(player: Player): void;
    removeResident(player: Player): void;
    addParty(party: Party): void;
    toJSON(): {
        lastUpdate: Date;
        id: number;
        name: string;
        state: number | undefined;
        needResidencyToWork: boolean;
        taxRate: number;
        marketTaxes: number;
        factoryOutputTaxes: {
            gold: number;
            oil: number;
            ore: number;
            uranium: number;
            diamonds: number;
        };
        autonomy: number | undefined;
        profitShare: number;
        borderRegions: number[];
        buildings: {
            militaryAcademy: number;
            hospital: number;
            militaryBase: number;
            school: number;
            missileSystem: number;
            seaPort: number;
            powerPlant: number;
            spaceport: number;
            airport: number;
            houseFund: number;
        };
        seaAccess: boolean;
        citizens: number[];
        residents: number[];
        parties: number[];
        resources: {
            gold: number;
            oil: number;
            ore: number;
            uranium: number;
            diamonds: number;
        };
        factories: number[];
    };
    static [Symbol.hasInstance](instance: any): boolean;
}
//# sourceMappingURL=Region.d.ts.map