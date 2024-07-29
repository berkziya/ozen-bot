import { Browser, BrowserContext, Page } from 'playwright';
import AsyncLock from 'async-lock';
import { Player } from './entity/Player';
export declare class UserContext {
    private browser;
    mobile: boolean;
    constructor(browser: Browser, mobile: boolean);
    context: BrowserContext;
    page: Page;
    id: number;
    player: Player;
    lock: AsyncLock;
    init(): Promise<void>;
    amILoggedIn(): Promise<boolean>;
    login(mail: string, password: string, useCookies?: boolean): Promise<number | null>;
    ajax(url: string, data?: string): Promise<void>;
}
export declare class Client {
    private browser;
    users: UserContext[];
    browserType: 'chromium' | 'firefox';
    headless: boolean;
    init(): Promise<Browser | null>;
    createUserContext(mobile?: boolean): Promise<UserContext>;
}
