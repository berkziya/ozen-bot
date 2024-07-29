"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = exports.UserContext = void 0;
const playwright_1 = require("playwright");
const async_lock_1 = __importDefault(require("async-lock"));
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const iPhoneUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/128.0 Mobile/15E148 Safari/605.1.15';
const mobileViewport = {
    width: 430,
    height: 932,
};
class UserContext {
    browser;
    mobile;
    constructor(browser, mobile) {
        this.browser = browser;
        this.mobile = mobile;
    }
    context;
    page;
    id;
    player;
    lock = new async_lock_1.default();
    async init() {
        await this.lock.acquire(['context', 'page'], async () => {
            const contextOptions = {
                baseURL: 'https://rivalregions.com',
                timezoneId: 'UTC',
                locale: 'en-US',
                viewport: this.mobile ? mobileViewport : undefined,
                userAgent: this.mobile ? iPhoneUserAgent : undefined,
                isMobile: this.mobile,
                hasTouch: this.mobile,
            };
            this.context = await this.browser.newContext(contextOptions);
            this.page = await this.context.newPage();
        });
    }
    async amILoggedIn() {
        try {
            await this.page.waitForSelector('#chat_send');
            return true;
        }
        catch (e) {
            return false;
        }
    }
    async login(mail, password, useCookies = true) {
        return this.lock.acquire(['context', 'page'], async () => {
            try {
                await this.page.goto('/');
                const sanitizedMail = mail.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                const cookiesPath = node_path_1.default.resolve(__dirname, '../../..', `${sanitizedMail}_${this.mobile ? 'mobile_' : ''}cookies.json`);
                if (useCookies) {
                    try {
                        await node_fs_1.promises.access(cookiesPath);
                        const cookiesData = await node_fs_1.promises.readFile(cookiesPath, 'utf8');
                        const cookies = JSON.parse(cookiesData);
                        await this.page.context().addCookies(cookies);
                        await this.page.reload();
                    }
                    catch (error) {
                        if (error.code !== 'ENOENT') {
                            throw error;
                        }
                        // File doesn't exist, proceed without cookies
                        useCookies = false;
                    }
                }
                if (!useCookies) {
                    await this.page.fill('input[name="mail"]', mail);
                    await this.page.fill('input[name="p"]', password);
                    await this.page.click('input[name="s"]');
                }
                if (!(await this.amILoggedIn())) {
                    if (useCookies) {
                        return this.login(mail, password, false);
                    }
                    return null;
                }
                this.id = await this.page.evaluate(() => {
                    // @ts-ignore
                    return id;
                });
                // this.player = await this.models.getPlayer(this.id!);
                const cookies = await this.page.context().cookies();
                await node_fs_1.promises.writeFile(cookiesPath, JSON.stringify(cookies));
                return this.id;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    async ajax(url, data = '') {
        return await this.lock.acquire(['page'], async () => {
            const jsAjax = `
      $.ajax({
        url: '${url}',
        data: { c: c_html, ${data} },
        type: 'POST',
      });`;
            await this.page.evaluate(jsAjax);
        });
    }
}
exports.UserContext = UserContext;
class Client {
    browser;
    users = [];
    browserType = 'firefox';
    headless = false;
    async init() {
        try {
            if (this.browserType === 'chromium') {
                this.browser = await playwright_1.chromium.launch({
                    headless: this.headless,
                    slowMo: 1000,
                });
            } /*if (this.browserType === 'firefox')*/
            else {
                this.browser = await playwright_1.firefox.launch({
                    headless: this.headless,
                    slowMo: 1000,
                });
            }
            if (!this.browser) {
                throw new Error('Browser not initialized');
            }
            return this.browser;
        }
        catch (e) {
            console.error(e);
            return null;
        }
    }
    async createUserContext(mobile = false) {
        const userContext = new UserContext(this.browser, mobile);
        await userContext.init();
        return userContext;
    }
}
exports.Client = Client;
