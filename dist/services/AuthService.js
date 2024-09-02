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
    cookies;
    c_html;
    constructor(browserService, isMobile) {
        this.browserService = browserService;
        this.isMobile = isMobile;
    }
    get link() {
        return `https://${this.isMobile ? 'm.' : ''}rivalregions.com`;
    }
    async saveCookies(source) {
        let cookiesDict;
        if (typeof source === 'string') {
            try {
                cookiesDict = JSON.parse(source);
            }
            catch (e) {
                throw new Error('Failed to parse cookies from string source');
            }
        }
        else
            cookiesDict = await source.cookies();
        this.cookies = cookiesDict
            .map((x) => `${x.name}=${x.value}`)
            .join('; ');
    }
    async login(mail, password, useCookies = true, cookies) {
        try {
            const { page, context } = await this.browserService.getPage();
            await page.goto(this.link);
            const sanitizedMail = mail.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const cookiesPath = node_path_1.default.join(Client_1.cookiesDir, `${sanitizedMail}-${this.isMobile ? 'm_' : ''}cookies.json`);
            if (cookies)
                await this.saveCookies(cookies);
            if (useCookies) {
                try {
                    await node_fs_1.promises.access(cookiesPath);
                    const cookiesData = await node_fs_1.promises.readFile(cookiesPath, 'utf8');
                    const cookies = JSON.parse(cookiesData);
                    await page.context().addCookies(cookies);
                    await page.reload();
                }
                catch {
                    console.log('Failed to load cookies');
                    // File doesn't exist, proceed without cookies
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
            const cookiesFromContext = await page.context().cookies();
            // Ensure the directory exists
            await node_fs_1.promises.mkdir(Client_1.cookiesDir, { recursive: true });
            await node_fs_1.promises.writeFile(cookiesPath, JSON.stringify(cookiesFromContext));
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
            this.c_html = content.match(/c_html = '([0-9a-f]{32})';/)[1];
            return true;
        }
        catch (e) {
            console.error('Failed to check if player is logged in:', e);
            return false;
        }
    }
}
exports.AuthService = AuthService;
