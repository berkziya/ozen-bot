import { User } from '../../../User';
export declare function amIMinister(user: User, playerId?: number): Promise<{
    leader: boolean;
    dicta: boolean;
    econ: boolean;
    foreign: boolean;
    governor: boolean;
} | null>;
