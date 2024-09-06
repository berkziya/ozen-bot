import { User } from '../../../User';
declare const resourceToId: {
    oil: number;
    ore: number;
    uranium: number;
    diamonds: number;
    liquidOxygen: number;
    helium3: number;
    rivalium: number;
    antirad: number;
    energyDrink: number;
    spaceRockets: number;
    lss: number;
    tanks: number;
    aircrafts: number;
    missiles: number;
    bombers: number;
    battleships: number;
    laserDrones: number;
    moonTanks: number;
    spaceStations: number;
};
export declare function parseMarketData(user: User, resource: keyof typeof resourceToId): Promise<{
    userId: number;
    amount: string;
    price: string;
}[] | null>;
export {};
