import { UserContext } from '../../../Client';
export declare function getParliamentInfo(user: UserContext, capitalId: number, isAutonomy?: boolean): Promise<{
    capitalId: number;
    lawId: number;
    by: number;
    text: string;
}[] | null>;
