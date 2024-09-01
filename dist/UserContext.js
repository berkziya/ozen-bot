"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserContext = void 0;
const async_lock_1 = __importDefault(require("async-lock"));
const AuthService_1 = require("./services/AuthService");
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const ContextService_1 = require("./services/ContextService");
const ModelService_1 = __importDefault(require("./services/ModelService"));
class UserContext {
    isMobile;
    authService;
    browserService;
    models = ModelService_1.default.getInstance();
    lock = new async_lock_1.default({ domainReentrant: true });
    player;
    id;
    constructor(browser, isMobile) {
        this.isMobile = isMobile;
        this.browserService = new ContextService_1.contextService(browser, isMobile);
        this.authService = new AuthService_1.AuthService(this.browserService, isMobile);
    }
    get link() {
        return this.browserService.link;
    }
    get cookies() {
        return this.authService.cookies;
    }
    async init() {
        await this.browserService.init();
    }
    async login(mail, password, useCookies = true) {
        return await this.lock.acquire(['context', 'page'], async () => {
            const resultId = await this.authService.login(mail, password, useCookies);
            if (resultId) {
                this.player = await this.models.getPlayer(resultId);
                this.id = resultId;
            }
            return resultId;
        });
    }
    async ajax(url, data = '') {
        const { page } = this.browserService;
        return await this.lock.acquire(['context', 'page'], async () => {
            await this.internetIsOn();
            const jsAjax = `
      $.ajax({
        url: '${url}',
        data: { c: c_html, ${data} },
        type: 'POST',
      });`;
            return await page.evaluate(jsAjax);
        });
    }
    async get(url) {
        const { context } = this.browserService;
        return await this.lock.acquire(['context', 'page'], async () => {
            await this.internetIsOn();
            const page = await context.newPage();
            await page.goto(url, { waitUntil: 'load' });
            const content = await page.content();
            await page.close();
            return { content };
        });
    }
    async internetIsOn() {
        const { page } = this.browserService;
        try {
            (0, tiny_invariant_1.default)(await page.evaluate(() => window.navigator.onLine), 'No internet connection');
            return true;
        }
        catch (e) {
            console.error('Internet is off:', e);
            return false;
        }
    }
}
exports.UserContext = UserContext;
