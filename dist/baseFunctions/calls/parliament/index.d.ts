import { UserContext } from '../../../UserContext';
import { Law } from '../../../entity/shared/Parliament';
import { Region } from '../../../entity/Region';
export declare function proLawByText(user: UserContext, text: string): Promise<boolean | null>;
export declare function proLaw(user: UserContext, capital: Region, law: Law): Promise<Response>;
export declare function cancelSelfLaw(user: UserContext): Promise<Response>;
