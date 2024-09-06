import { resourceIds } from '.';
import { User } from '../../../User';
export declare function resourceRefill(user: User, resource?: keyof typeof resourceIds): Promise<boolean | null | undefined>;
