import { User } from '../../../User';
import { Region } from '../../../entity/Region';
import { Law } from '../../../entity/shared/Parliament';
export declare const resourceIds: {
    money: number;
    gold: number;
    oil: number;
    ore: number;
    uranium: number;
    diamonds: number;
};
export declare function proLawByText(user: User, text: string): Promise<boolean | null>;
export declare function proLaw(user: User, capital: Region, law: Law): Promise<Response>;
export declare function cancelSelfLaw(user: User): Promise<Response>;
