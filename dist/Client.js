"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = exports.cookiesDir = void 0;
const playwright_1 = require("playwright");
const UserContext_1 = require("./UserContext");
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const node_fs_1 = require("node:fs");
const ModelService_1 = require("./services/ModelService");
const node_path_1 = __importDefault(require("node:path"));
exports.cookiesDir = node_path_1.default.join(process.cwd(), 'cookies');
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
    async autoCreateContexts() {
        const jsonFiles = (await node_fs_1.promises.readdir(exports.cookiesDir)).filter((file) => file.endsWith('.json'));
        for (const file of jsonFiles) {
            const filePath = node_path_1.default.join(exports.cookiesDir, file);
            const fileContents = await node_fs_1.promises.readFile(filePath, 'utf-8');
            const user = await this.createUserContext();
            const id = await user?.login(file.split('-')[0], null, true, fileContents);
            if (id)
                this.users.add(user);
        }
    }
}
exports.Client = Client;
