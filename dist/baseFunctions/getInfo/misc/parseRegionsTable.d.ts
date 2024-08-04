import { UserContext } from '../../../Client';
export declare function parseRegionsTable(user: UserContext, stateId?: number | null): Promise<{
    [key: string]: string;
}[]>;
