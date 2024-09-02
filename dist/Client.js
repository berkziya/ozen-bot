"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const playwright_1 = require("playwright");
const UserContext_1 = require("./UserContext");
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const ModelService_1 = require("./services/ModelService");
class Client {
    browser;
    modelService = ModelService_1.ModelService.getInstance();
    users = new Set();
    async init({ headless = true, } = {}) {
        try {
            this.browser = await playwright_1.firefox.launch({
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
    async isClientValid() {
        try {
            (0, tiny_invariant_1.default)(this.browser, 'Can not find the browser');
            return true;
        }
        catch (e) {
            console.error('Context validation failed:', e);
            return false;
        }
    }
    async createUserContext({ isMobile = false, } = {}) {
        try {
            const userContext = new UserContext_1.UserContext(this.browser, isMobile);
            this.users.add(userContext);
            return userContext;
        }
        catch (e) {
            console.error('Failed to create user context:', e);
            return null;
        }
    }
}
exports.Client = Client;
