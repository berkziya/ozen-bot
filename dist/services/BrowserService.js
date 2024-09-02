"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserService = exports.iPhoneUserAgent = void 0;
exports.iPhoneUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/130.0 Mobile/15E148 Safari/605.1.15';
const mobileViewport = {
    width: 430,
    height: 932,
};
class BrowserService {
    browser;
    isMobile;
    context;
    page;
    constructor(browser, isMobile) {
        this.browser = browser;
        this.isMobile = isMobile;
    }
    async getPage() {
        this.context = await this.browser.newContext({
            timezoneId: 'UTC',
            locale: 'en-US',
            viewport: this.isMobile ? mobileViewport : undefined,
            userAgent: this.isMobile ? exports.iPhoneUserAgent : undefined,
            hasTouch: this.isMobile,
        });
        this.page = await this.context.newPage();
        return { page: this.page, context: this.context };
    }
    async closePage() {
        await this.context.close();
    }
}
exports.BrowserService = BrowserService;
