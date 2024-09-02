import { Browser } from 'playwright';
import { UserContext } from './UserContext';
import { ModelService } from './services/ModelService';
export declare const cookiesDir: string;
export declare class Client {
    browser: Browser;
    modelService: ModelService;
    users: Set<UserContext>;
    init({ headless, }?: {
        headless?: boolean;
    }): Promise<Browser | null>;
    isClientValid(): Promise<boolean>;
    createUserContext({ isMobile, }?: {
        isMobile?: boolean;
    }): Promise<UserContext | null>;
    autoCreateContexts(): Promise<void>;
}
