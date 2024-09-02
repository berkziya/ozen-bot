import { Browser, BrowserContext, Page } from 'playwright';
export declare const iPhoneUserAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/129.0 Mobile/15E148 Safari/605.1.15";
export declare class BrowserService {
    private browser;
    private isMobile;
    context: BrowserContext;
    page: Page;
    constructor(browser: Browser, isMobile: boolean);
    getPage(): Promise<Page>;
    closePage(): Promise<void>;
}
