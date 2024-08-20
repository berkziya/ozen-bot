import { UserContext } from '../../../UserContext';
import { Law } from '../../../entity/shared/Parliament';
export declare function proLaw(user: UserContext, capitalId: number, law: Law): Promise<void>;
export declare function cancelSelfLaw(user: UserContext): Promise<void>;
