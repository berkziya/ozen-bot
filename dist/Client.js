"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const playwright_1 = require("playwright");
const ModelHandler_1 = __importDefault(require("./ModelHandler"));
const UserContext_1 = require("./UserContext");
class Client {
    constructor({ browserType = 'firefox', } = {}) {
        this.browserType_ = browserType == 'chromium' ? playwright_1.chromium : playwright_1.firefox;
    }
    browserType_;
    browser;
    models = new ModelHandler_1.default();
    users = new Set();
    async init({ headless = true, } = {}) {
        try {
            this.browser = await this.browserType_.launch({
                headless,
                slowMo: 1000,
            });
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
    async createUserContext({ isMobile = false, } = {}) {
        const userContext = new UserContext_1.UserContext(this.browser, isMobile, this.models);
        await userContext.init();
        this.users.add(userContext);
        return userContext;
    }
}
exports.Client = Client;
