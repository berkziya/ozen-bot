"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserService = exports.iPhoneUserAgent = void 0;
const node_path_1 = __importDefault(require("node:path"));
const playwright_1 = require("playwright");
const UserHandler_1 = require("../UserHandler");
exports.iPhoneUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/130.0 Mobile/15E148 Safari/605.1.15';
const mobileViewport = { width: 430, height: 932 };
class BrowserService {
    who;
    isMobile;
    context;
    page;
    constructor(who, isMobile) {
        this.who = who;
        this.isMobile = isMobile;
    }
    get link() {
        return `https://${this.isMobile ? 'm.' : ''}rivalregions.com`;
    }
    async getPage() {
        if (!this.context)
            this.context = await playwright_1.firefox.launchPersistentContext(node_path_1.default.join(UserHandler_1.browserDir, this.who), {
                headless: true,
                timezoneId: 'UTC',
                locale: 'en-US',
                viewport: this.isMobile ? mobileViewport : undefined,
                userAgent: this.isMobile ? exports.iPhoneUserAgent : undefined,
                hasTouch: this.isMobile,
            });
        this.page = this.context.pages()[0];
        await this.page.goto(this.link);
        return { page: this.page, context: this.context };
    }
    async closePage() {
        if (this.context)
            await this.context.close();
    }
}
exports.BrowserService = BrowserService;
