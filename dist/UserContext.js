"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserContext = exports.iPhoneUserAgent = void 0;
const async_lock_1 = __importDefault(require("async-lock"));
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
exports.iPhoneUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/129.0 Mobile/15E148 Safari/605.1.15';
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
    lock = new async_lock_1.default({ domainReentrant: true });
    cookies = '';
    get link() {
        return `https://${this.isMobile ? 'm.' : ''}rivalregions.com`;
    }
    async init() {
        await this.lock.acquire(['context', 'page'], async () => {
            const contextOptions = {
                baseURL: this.link,
                timezoneId: 'UTC',
                locale: 'en-US',
                viewport: this.isMobile ? mobileViewport : undefined,
                userAgent: this.isMobile ? exports.iPhoneUserAgent : undefined,
                hasTouch: this.isMobile,
            };
            this.context = await this.browser.newContext(contextOptions);
            this.page = await this.context.newPage();
        });
    }
    async isContextValid() {
        try {
            (0, tiny_invariant_1.default)(this.browser, "Can't find browser");
            (0, tiny_invariant_1.default)(this.context, 'Context is not initialized');
            (0, tiny_invariant_1.default)(this.page, 'Page is not initialized');
            (0, tiny_invariant_1.default)(this.amILoggedIn, 'Player is not logged in');
            return true;
        }
        catch (e) {
            console.error('Session validation failed:', e);
            return false;
        }
    }
    async amILoggedIn() {
        try {
            const cookiesFromContext = await this.context.cookies();
            this.cookies = cookiesFromContext
                .map((x) => `${x.name}=${x.value}`)
                .join('; ');
            const x = await fetch(this.link + '/map/details/100002', {
                headers: {
                    cookie: this.cookies,
                },
            });
            (0, tiny_invariant_1.default)(x.status === 200, 'No response from the server');
            const content = await x.text();
            (0, tiny_invariant_1.default)(content.length > 150, 'Player is not logged in');
            return true;
        }
        catch (e) {
            console.error('Failed to check if player is logged in:', e);
            return false;
        }
    }
    async login(mail, password, useCookies = true) {
        return this.lock.acquire(['context', 'page'], async () => {
            try {
                await this.internetIsOn();
                await this.page.goto('/');
                const sanitizedMail = mail.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                const cookiesDir = node_path_1.default.join(__dirname, 'cookies');
                const cookiesPath = node_path_1.default.join(cookiesDir, `${sanitizedMail}_${this.isMobile ? 'mobile_' : ''}cookies.json`);
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
                    else {
                        throw new Error('Failed to login');
                    }
                }
                this.id = await this.page.evaluate(() => id);
                this.player = await this.models.getPlayer(this.id);
                const cookies = await this.page.context().cookies();
                // Ensure the directory exists
                await node_fs_1.promises.mkdir(cookiesDir, { recursive: true });
                // Write cookies to the file
                await node_fs_1.promises.writeFile(cookiesPath, JSON.stringify(cookies));
                return this.id;
            }
            catch (e) {
                console.error('Failed to login:', e);
                return null;
            }
        });
    }
    async ajax(url, data = '') {
        return await this.lock.acquire(['context', 'page'], async () => {
            await this.internetIsOn();
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
            await this.internetIsOn();
            await this.page.goto(url);
            const content = await this.page.content();
            await this.page.goto(this.link);
            return { content };
        });
    }
    async internetIsOn() {
        // window.navigator.onLine
        // returns true if the browser is online
        try {
            (0, tiny_invariant_1.default)(await this.page.evaluate(() => window.navigator.onLine), 'No internet connection');
            return true;
        }
        catch (e) {
            console.error('Internet is off:', e);
            return false;
        }
    }
}
exports.UserContext = UserContext;
