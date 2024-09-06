import { User } from '../../../User';
export declare function choosePerkToUpgrade(user: User, gold?: string[]): Promise<{
    perk: string;
    time: number;
    gold: string[];
}>;
