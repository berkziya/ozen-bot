"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const sanitizer_1 = require("./misc/sanitizer");
const AuthService_1 = require("./services/AuthService");
const BrowserService_1 = require("./services/BrowserService");
const ModelService_1 = require("./services/ModelService");
class User {
    who;
    isMobile;
    authService;
    browserService;
    models = ModelService_1.ModelService.getInstance();
    player;
    constructor(who, isMobile = false) {
        this.who = who;
        this.isMobile = isMobile;
        const sanitizedWho = (0, sanitizer_1.sanitizer)(who);
        this.browserService = new BrowserService_1.BrowserService(sanitizedWho, isMobile);
        this.authService = new AuthService_1.AuthService(sanitizedWho, isMobile, this.browserService);
    }
    get id() {
        return this.player.id;
    }
    get link() {
        return this.browserService.link;
    }
    get cookies() {
        return this.authService.cookies;
    }
    get c_html() {
        return this.authService.c_html;
    }
    async amILoggedIn() {
        return await this.authService.amILoggedIn();
    }
    async init(mail, password, cookies) {
        const result = await this.authService.login(mail, password, cookies);
        await this.browserService.closePage();
        (0, tiny_invariant_1.default)(result, 'Login failed');
        this.player = await this.models.getPlayer(result);
        return result;
    }
    async ajax(url, data) {
        const formData = new FormData();
        formData.append('c', this.c_html);
        if (data) {
            for (const [key, value] of Object.entries(data)) {
                formData.append(key, value.toString());
            }
        }
        const result = await fetch(this.link + url, {
            method: 'POST',
            headers: {
                Cookie: this.cookies,
            },
            body: formData,
        });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return result;
    }
    async get(url) {
        return await fetch(this.link + url + '?c=' + this.c_html, {
            headers: {
                Cookie: this.cookies,
            },
        }).then((res) => res.text());
    }
}
exports.User = User;
