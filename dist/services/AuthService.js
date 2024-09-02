"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
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
    async login(mail, password, useCookies = true) {
        try {
            const page = await this.browserService.getPage();
            await page.goto(this.link);
            const sanitizedMail = mail.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const cookiesDir = node_path_1.default.join(process.cwd(), 'cookies');
            const cookiesPath = node_path_1.default.join(cookiesDir, `${sanitizedMail}_${this.isMobile ? 'm_' : ''}cookies.json`);
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
                await page.fill('input[name="mail"]', mail);
                await page.fill('input[name="p"]', password);
                await page.click('input[name="s"]');
            }
            await page.waitForSelector('#chat_send');
            if (!(await this.amILoggedIn())) {
                if (useCookies) {
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
            const cookies = await page.context().cookies();
            // Ensure the directory exists
            await node_fs_1.promises.mkdir(cookiesDir, { recursive: true });
            // Write cookies to the file
            await node_fs_1.promises.writeFile(cookiesPath, JSON.stringify(cookies));
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
        const { context } = this.browserService;
        try {
            const cookiesFromContext = await context.cookies();
            this.cookies = cookiesFromContext
                .map((x) => `${x.name}=${x.value}`)
                .join('; ');
            const x = await fetch(this.link + '/map/details/100002', {
                headers: { cookie: this.cookies },
            });
            if (x.status !== 200)
                throw new Error('No response from the server');
            const content = await x.text();
            if (content.length <= 150)
                throw new Error('Player is not logged in');
            return true;
        }
        catch (e) {
            console.error('Failed to check if player is logged in:', e);
            return false;
        }
    }
}
exports.AuthService = AuthService;
