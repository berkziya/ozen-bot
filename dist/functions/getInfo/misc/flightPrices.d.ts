import { Region } from '../../../entity/Region';
export declare function flightPrices(location: Region): Promise<{
    [key: number]: {
        price: number;
        time: number;
        bordersOpen: boolean;
    };
} | null>;
