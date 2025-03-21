import { User } from '../../../user/User';
import { Region } from '../../../entity/Region';
import { Law } from '../../../entity/shared/Parliament';
export { resourceRefill } from './resourceRefill';
export { transferBudget } from './transferBudget';
export declare const resourceIds: {
    money: number;
    gold: number;
    oil: number;
    ore: number;
    uranium: number;
    diamonds: number;
};
export declare function proLawByText(user: User, text: string): Promise<boolean>;
export declare function proLaw(user: User, capital: Region, law: Law): Promise<Response>;
export declare function cancelSelfLaw(user: User): Promise<Response>;
//# sourceMappingURL=index.d.ts.map