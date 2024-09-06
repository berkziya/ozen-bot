import { BrowserContext, Page } from 'playwright';
export declare const iPhoneUserAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/130.0 Mobile/15E148 Safari/605.1.15";
export declare class BrowserService {
    private who;
    private isMobile;
    private context;
    private page;
    constructor(who: string, isMobile: boolean);
    get link(): string;
    getPage(): Promise<{
        page: Page;
        context: BrowserContext;
    }>;
    closePage(): Promise<void>;
}
