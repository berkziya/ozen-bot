import { Browser } from 'playwright';
import ModelHandler from './ModelHandler';
import { UserContext } from './UserContext';
export declare class Client {
    constructor({ browserType, models, }?: {
        browserType?: 'chromium' | 'firefox';
        models?: ModelHandler;
    });
    private browserType_;
    browser: Browser;
    models: ModelHandler;
    users: Set<UserContext>;
    init({ headless, }?: {
        headless?: boolean;
    }): Promise<Browser | null>;
    createUserContext({ isMobile, }?: {
        isMobile?: boolean;
    }): Promise<UserContext>;
}
