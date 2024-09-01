"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contextService = exports.iPhoneUserAgent = void 0;
exports.iPhoneUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/129.0 Mobile/15E148 Safari/605.1.15';
const mobileViewport = {
    width: 430,
    height: 932,
};
class contextService {
    browser;
    isMobile;
    context;
    page;
    constructor(browser, isMobile) {
        this.browser = browser;
        this.isMobile = isMobile;
    }
    get link() {
        return `https://${this.isMobile ? 'm.' : ''}rivalregions.com`;
    }
    async init() {
        this.context = await this.browser.newContext({
            baseURL: this.link,
            timezoneId: 'UTC',
            locale: 'en-US',
            viewport: this.isMobile ? mobileViewport : undefined,
            userAgent: this.isMobile ? exports.iPhoneUserAgent : undefined,
            hasTouch: this.isMobile,
        });
        this.page = await this.context.newPage();
    }
}
exports.contextService = contextService;
