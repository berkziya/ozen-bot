"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const UserHandler_1 = require("../UserHandler");
const sanitizer_1 = require("../misc/sanitizer");
class AuthService {
    who;
    isMobile;
    browserService;
    cookieDict;
    c_html;
    constructor(who, isMobile, browserService) {
        this.who = who;
        this.isMobile = isMobile;
        this.browserService = browserService;
        this.who = (0, sanitizer_1.sanitizer)(who);
    }
    get cookies() {
        return this.cookieDict
            .map((x) => `${x.name}=${x.value}`)
            .join('; ');
    }
    get cookiesPath() {
        return node_path_1.default.join(UserHandler_1.cookiesDir, `${this.who}-${this.isMobile ? 'm_' : ''}cookies.json`);
    }
    async saveCookies(source) {
        try {
            if (!(typeof source === 'string'))
                source = JSON.stringify(await source.cookies());
            this.cookieDict = JSON.parse(source);
            await node_fs_1.promises.mkdir(UserHandler_1.cookiesDir, { recursive: true });
            await node_fs_1.promises.writeFile(this.cookiesPath, source);
        }
        catch (e) {
            console.error(e);
        }
    }
    async amILoggedIn() {
        try {
            const x = await fetch(this.browserService.link + '/map/details/100002', {
                headers: { cookie: this.cookies },
            });
            (0, tiny_invariant_1.default)(x.status == 200, 'No response from the server');
            const content = await x.text();
            (0, tiny_invariant_1.default)(content.length > 150, 'Player is not logged in');
            this.c_html = content.match(/c_html = '([a-f0-9]{32})';/)[1];
            return true;
        }
        catch {
            return false;
        }
    }
    async login(mail, password, cookies) {
        try {
            const data = await this.browserService.getPage();
            if (!data)
                return null;
            const { page, context } = data;
            const onSuccess = async () => {
                this.saveCookies(context);
                const id = await page.evaluate(() => id);
                const c_html = await page.evaluate(() => c_html);
                this.c_html = c_html;
                return id;
            };
            try {
                // check if already logged in
                const id = await page.evaluate(() => id);
                if (id)
                    return onSuccess();
            }
            catch (e) {
                console.error('Not logged in', e);
            }
            try {
                // check if there is a cookie file
                await node_fs_1.promises.access(this.cookiesPath);
                const cookiesData = await node_fs_1.promises.readFile(this.cookiesPath, 'utf8');
                const cookies = JSON.parse(cookiesData);
                await page.context().addCookies(cookies);
                await page.reload();
                await page.waitForSelector('#header_content', { timeout: 5000 });
                return onSuccess();
            }
            catch (e) {
                console.error('No cookie file', e);
            }
            if (mail && password) {
                try {
                    await page.fill('input[name="mail"]', mail);
                    await page.fill('input[name="p"]', password);
                    await page.click('input[name="s"]');
                    await page.waitForSelector('#header_content', { timeout: 5000 });
                    return onSuccess();
                }
                catch (e) {
                    console.error('Failed to login with given credentials', e);
                }
            }
            if (cookies) {
                try {
                    await page.context().addCookies(JSON.parse(cookies));
                    await page.reload();
                    await page.waitForSelector('#header_content', { timeout: 5000 });
                    return onSuccess();
                }
                catch (e) {
                    console.error('Failed to login with given cookies', e);
                }
            }
            return null;
        }
        catch (e) {
            console.error('Failed to login:', e);
            return null;
        }
    }
}
exports.AuthService = AuthService;
