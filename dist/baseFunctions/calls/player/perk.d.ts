import { User } from '../../../User';
declare const perkToId: {
    str: number;
    edu: number;
    end: number;
};
declare const currencyToId: {
    money: number;
    gold: number;
};
export declare function getPerkUpgradeTimes(user: User): {
    str: number;
    edu: number;
    end: number;
};
export declare function upgradePerk(user: User, perk: keyof typeof perkToId, currency?: keyof typeof currencyToId): Promise<Response>;
export {};