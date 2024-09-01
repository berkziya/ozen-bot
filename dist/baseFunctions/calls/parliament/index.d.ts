import { UserContext } from '../../../UserContext';
import { Law } from '../../../entity/shared/Parliament';
export declare function proLawByText(user: UserContext, text: string): Promise<boolean | null>;
export declare function proLaw(user: UserContext, capitalId: number, law: Law): Promise<unknown>;
export declare function cancelSelfLaw(user: UserContext): Promise<unknown>;
