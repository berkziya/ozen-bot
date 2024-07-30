import { State } from './State';
import { Autonomy } from './Autonomy';
import { Player } from './Player';
export declare class Region {
    lastUpdate: number;
    id: number;
    name: string;
    state: State | null;
    autonomy: Autonomy | null;
    borderRegions: Region[];
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
    citizens: Player[];
    residents: Player[];
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
    toJSON(): {
        lastUpdate: number;
        id: number;
        name: string;
        state: number | undefined;
        autonomy: number | undefined;
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
        resources: {
            gold: number;
            oil: number;
            ore: number;
            uranium: number;
            diamonds: number;
        };
    };
}
