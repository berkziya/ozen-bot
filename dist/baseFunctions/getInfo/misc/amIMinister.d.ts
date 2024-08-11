import { UserContext } from '../../../UserContext';
export declare function amIMinister(user: UserContext, playerId?: number): Promise<{
    leader: boolean;
    dicta: boolean;
    econ: boolean;
    foreign: boolean;
    governor: boolean;
}>;
