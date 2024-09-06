import { User } from './User';
import { ModelService } from './services/ModelService';
export declare const cookiesDir: string;
export declare const browserDir: string;
export declare class UserHandler {
    private static instance;
    modelService: ModelService;
    users: Set<User>;
    private constructor();
    static getInstance(): UserHandler;
    getUser(id?: number, who?: string): User | undefined;
    createUser(who: string, mail?: string, password?: string, cookies?: string): Promise<User>;
    autoCreateUsers(): Promise<void>;
}
