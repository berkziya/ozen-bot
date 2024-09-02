"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserContext = void 0;
const AuthService_1 = require("./services/AuthService");
const BrowserService_1 = require("./services/BrowserService");
const ModelService_1 = require("./services/ModelService");
class UserContext {
    isMobile;
    authService;
    browserService;
    models = ModelService_1.ModelService.getInstance();
    player;
    constructor(browser, isMobile) {
        this.isMobile = isMobile;
        this.browserService = new BrowserService_1.BrowserService(browser, isMobile);
        this.authService = new AuthService_1.AuthService(this.browserService, isMobile);
    }
    get id() {
        return this.player.id;
    }
    get link() {
        return `https://${this.isMobile ? 'm.' : ''}rivalregions.com`;
    }
    get cookies() {
        return this.authService.cookies;
    }
    get c_html() {
        return this.authService.c_html;
    }
    async login(mail, password, useCookies = true, cookies) {
        const result = await this.authService.login(mail, password, useCookies, cookies);
        if (result)
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
        console.log(formData);
        return await fetch(this.link + url, {
            method: 'POST',
            headers: {
                Cookie: this.cookies,
            },
            body: formData,
        });
    }
    async get(url) {
        return await fetch(this.link + url + '?c=' + this.c_html, {
            headers: {
                Cookie: this.cookies,
            },
        }).then((res) => res.text());
    }
}
exports.UserContext = UserContext;
