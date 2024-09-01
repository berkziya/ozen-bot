"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
class AuthService {
    contextService;
    isMobile;
    cookies = '';
    constructor(contextService, isMobile) {
        this.contextService = contextService;
        this.isMobile = isMobile;
    }
    async login(mail, password, useCookies = true) {
        const { page } = this.contextService;
        try {
            await page.goto('/');
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
    }
    async amILoggedIn() {
        const { context } = this.contextService;
        try {
            const cookiesFromContext = await context.cookies();
            this.cookies = cookiesFromContext
                .map((x) => `${x.name}=${x.value}`)
                .join('; ');
            const x = await fetch(this.contextService.link + '/map/details/100002', {
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
