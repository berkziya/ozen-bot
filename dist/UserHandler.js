"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserHandler = exports.browserDir = exports.cookiesDir = void 0;
const User_1 = require("./User");
const node_fs_1 = require("node:fs");
const ModelService_1 = require("./services/ModelService");
const node_path_1 = __importDefault(require("node:path"));
exports.cookiesDir = node_path_1.default.join(process.cwd(), 'cookies');
exports.browserDir = node_path_1.default.join(process.cwd(), 'browsers');
class UserHandler {
    static instance;
    modelService = ModelService_1.ModelService.getInstance();
    users = new Set();
    constructor() { }
    static getInstance() {
        if (!UserHandler.instance) {
            UserHandler.instance = new UserHandler();
        }
        return UserHandler.instance;
    }
    getUser(id, who) {
        if (id)
            return [...this.users].find((u) => u.id === id);
        if (who)
            return [...this.users].find((u) => u.who === who);
        const random = Math.floor(Math.random() * this.users.size);
        return [...this.users][random];
    }
    async createUser(who, mail, password, cookies) {
        const user = new User_1.User(who);
        const id = await user.init(mail, password, cookies);
        if (id)
            this.users.add(user);
        return user;
    }
    async autoCreateUsers() {
        const jsonFiles = (await node_fs_1.promises.readdir(exports.cookiesDir)).filter((file) => file.endsWith('.json'));
        for (const file of jsonFiles) {
            const filePath = node_path_1.default.join(exports.cookiesDir, file);
            const fileContents = await node_fs_1.promises.readFile(filePath, 'utf-8');
            const who = file.split('-')[0];
            await this.createUser(who, undefined, undefined, fileContents);
        }
    }
}
exports.UserHandler = UserHandler;
