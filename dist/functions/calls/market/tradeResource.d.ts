import { resourceToId } from '.';
import { User } from '../../../User';
export declare function buyResource(user: User, resource: keyof typeof resourceToId, amount: number): Promise<Response>;
export declare function sellResource(user: User, resource: keyof typeof resourceToId, amount: number, price: number): Promise<Response>;
export declare function getMyOffer(user: User, resource: keyof typeof resourceToId): Promise<{
    amount: number;
    price: number;
    sellLock: number;
} | null>;
