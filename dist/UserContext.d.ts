import { Browser, BrowserContext, Page } from 'playwright';
import AsyncLock from 'async-lock';
import { Player } from './entity/Player';
import ModelHandler from './ModelHandler';
export declare const iPhoneUserAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/129.0 Mobile/15E148 Safari/605.1.15";
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
    internetIsOn(timeout?: number): Promise<unknown>;
}
