import { ModelService } from './services/ModelService';
import { User } from './User';
export declare const cookiesDir: string;
export declare class UserHandler {
    private static instance;
    modelService: ModelService;
    users: User[];
    private constructor();
    static getInstance(): UserHandler;
    getUser(id?: number, who?: string): User | undefined;
    createUser(who: string, mail?: string, password?: string, cookies?: string): Promise<User>;
    autoCreateUsers(): Promise<void>;
}
