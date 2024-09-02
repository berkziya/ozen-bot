"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const Client_1 = require("../Client");
class AuthService {
    browserService;
    isMobile;
    mail;
    cookieDict;
    c_html;
    constructor(browserService, isMobile) {
        this.browserService = browserService;
        this.isMobile = isMobile;
    }
    get link() {
        return `https://${this.isMobile ? 'm.' : ''}rivalregions.com`;
    }
    get cookies() {
        return this.cookieDict
            .map((x) => `${x.name}=${x.value}`)
            .join('; ');
    }
    get cookiesPath() {
        const sanitizedMail = this.mail.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        return node_path_1.default.join(Client_1.cookiesDir, `${sanitizedMail}-${this.isMobile ? 'm_' : ''}cookies.json`);
    }
    async saveCookies(source) {
        if (!(typeof source === 'string'))
            source = JSON.stringify(await source.cookies());
        this.cookieDict = JSON.parse(source);
        await node_fs_1.promises.mkdir(Client_1.cookiesDir, { recursive: true });
        await node_fs_1.promises.writeFile(this.cookiesPath, source);
    }
    async login(mail, password, useCookies = true, cookies) {
        this.mail = mail;
        try {
            const { page, context } = await this.browserService.getPage();
            await page.goto(this.link);
            if (useCookies) {
                try {
                    await node_fs_1.promises.access(this.cookiesPath);
                    const cookiesData = await node_fs_1.promises.readFile(this.cookiesPath, 'utf8');
                    const cookies = JSON.parse(cookiesData);
                    await page.context().addCookies(cookies);
                    await page.reload();
                }
                catch {
                    if (cookies)
                        await this.saveCookies(cookies);
                    else
                        useCookies = false;
                }
            }
            if (!useCookies) {
                (0, tiny_invariant_1.default)(password, 'No password given');
                await page.fill('input[name="mail"]', mail);
                await page.fill('input[name="p"]', password);
                await page.click('input[name="s"]');
            }
            await page.waitForSelector('#chat_send');
            await this.saveCookies(context);
            if (!(await this.amILoggedIn())) {
                if (useCookies && password) {
                    return this.login(mail, password, false);
                }
                else {
                    throw new Error('Failed to login');
                }
            }
            const id = await page.evaluate(() => id);
            (0, tiny_invariant_1.default)(id, 'Failed to get player id');
            const c_html = await page.evaluate(() => c_html);
            this.c_html = c_html;
            return id;
        }
        catch (e) {
            console.error('Failed to login:', e);
            return null;
        }
        finally {
            await this.browserService.closePage();
        }
    }
    async amILoggedIn() {
        try {
            const x = await fetch(this.link + '/map/details/100002', {
                headers: { cookie: this.cookies },
            });
            (0, tiny_invariant_1.default)(x.status == 200, 'No response from the server');
            const content = await x.text();
            (0, tiny_invariant_1.default)(content.length > 150, 'Player is not logged in');
            this.c_html = content.match(/c_html = '([a-f0-9]{32})';/)[1];
            return true;
        }
        catch (e) {
            console.error('Failed to check if player is logged in:', e);
            return false;
        }
    }
}
exports.AuthService = AuthService;
