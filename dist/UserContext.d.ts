import { Browser, BrowserContext, Page } from 'playwright';
import AsyncLock from 'async-lock';
import { Player } from './entity/Player';
import ModelHandler from './ModelHandler';
export declare class UserContext {
    private browser;
    isMobile: boolean;
    models: ModelHandler;
    constructor(browser: Browser, isMobile: boolean, models: ModelHandler);
    context: BrowserContext;
    page: Page;
    id: number;
    player: Player;
    lock: AsyncLock;
    cookies: string;
    get link(): string;
    init(): Promise<void>;
    isContextValid(): Promise<boolean>;
    amILoggedIn(): Promise<boolean>;
    login(mail: string, password: string, useCookies?: boolean): Promise<number | null>;
    ajax(url: string, data?: string): Promise<void>;
    get(url: string): Promise<{
        content: string;
    }>;
    internetIsOn(): Promise<unknown>;
}
