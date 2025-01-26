"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserHandler = exports.cookiesDir = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const ModelService_1 = require("../services/ModelService");
const User_1 = require("./User");
exports.cookiesDir = path_1.default.join(process.cwd(), 'cookies');
class UserHandler {
    static instance;
    modelService = ModelService_1.ModelService.getInstance();
    users = [];
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
        const random = Math.floor(Math.random() * this.users.length);
        return [...this.users][random];
    }
    async createUser(who, mail, password, cookies) {
        const existing = this.users.find((u) => u.who === who);
        const user = existing || new User_1.User(who);
        const id = await user.init(mail, password, cookies);
        if (id)
            this.users.push(user);
        return user;
    }
    async autoCreateUsers() {
        const jsonFiles = (await fs_1.promises.readdir(exports.cookiesDir)).filter((file) => file.endsWith('.json'));
        for (const file of jsonFiles) {
            const filePath = path_1.default.join(exports.cookiesDir, file);
            const fileContents = await fs_1.promises.readFile(filePath, 'utf-8');
            const who = file.split('-')[0];
            await this.createUser(who, undefined, undefined, fileContents);
        }
    }
}
exports.UserHandler = UserHandler;
