"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserContext = void 0;
const async_lock_1 = __importDefault(require("async-lock"));
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const iPhoneUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/129.0 Mobile/15E148 Safari/605.1.15';
const mobileViewport = {
    width: 430,
    height: 932,
};
let id;
class UserContext {
    browser;
    isMobile;
    models;
    constructor(browser, isMobile, models) {
        this.browser = browser;
        this.isMobile = isMobile;
        this.models = models;
    }
    context;
    page;
    id;
    player;
    lock = new async_lock_1.default();
    cookies = '';
    async init() {
        await this.lock.acquire(['context', 'page'], async () => {
            const contextOptions = {
                baseURL: 'https://rivalregions.com',
                timezoneId: 'UTC',
                locale: 'en-US',
                viewport: this.isMobile ? mobileViewport : undefined,
                userAgent: this.isMobile ? iPhoneUserAgent : undefined,
                isMobile: this.isMobile,
                hasTouch: this.isMobile,
            };
            this.context = await this.browser.newContext(contextOptions);
            this.page = await this.context.newPage();
        });
    }
    async amILoggedIn() {
        try {
            await this.page.waitForSelector('#chat_send');
            const cookiesFromContext = await this.context.cookies();
            this.cookies = cookiesFromContext
                .map((x) => `${x.name}=${x.value}`)
                .join('; ');
            return true;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }
    async login(mail, password, useCookies = true) {
        return this.lock.acquire(['context', 'page'], async () => {
            try {
                await this.page.goto('/');
                let fails = 0;
                while (!this.internetIsOn() && fails < 5) {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    fails++;
                }
                if (fails >= 5) {
                    throw new Error('No internet connection');
                }
                const sanitizedMail = mail.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                const cookiesPath = node_path_1.default.resolve(__dirname, '../../..', `${sanitizedMail}_${this.isMobile ? 'mobile_' : ''}cookies.json`);
                if (useCookies) {
                    try {
                        await node_fs_1.promises.access(cookiesPath);
                        const cookiesData = await node_fs_1.promises.readFile(cookiesPath, 'utf8');
                        const cookies = JSON.parse(cookiesData);
                        await this.page.context().addCookies(cookies);
                        await this.page.reload();
                    }
                    catch {
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
                this.id = await this.page.evaluate(() => id);
                this.player = await this.models.getPlayer(this.id);
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
        return await this.lock.acquire(['context', 'page'], async () => {
            const jsAjax = `
      $.ajax({
        url: '${url}',
        data: { c: c_html, ${data} },
        type: 'POST',
      });`;
            await this.page.evaluate(jsAjax);
        });
    }
    async get(url) {
        return await this.lock.acquire(['context', 'page'], async () => {
            await this.page.goto(url);
            return { content: await this.page.content() };
        });
    }
    async internetIsOn() {
        return await this.page.evaluate(() => {
            return new Promise((resolve) => {
                if (navigator.onLine) {
                    resolve(true);
                }
                else {
                    window.addEventListener('online', () => resolve(true));
                }
            });
        });
    }
    async imAlive() {
        return await this.lock.acquire(['page', 'context'], async () => {
            try {
                if (!this.internetIsOn()) {
                    throw new Error('No internet connection');
                }
                return await this.page.evaluate(() => id);
            }
            catch (e) {
                console.error(e);
                return null;
            }
        });
    }
}
exports.UserContext = UserContext;