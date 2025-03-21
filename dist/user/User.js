import invariant from 'tiny-invariant';
import { sanitizer } from '../misc/sanitizer';
import AuthService from '../services/AuthService';
import BrowserService from '../services/BrowserService';
import ModelService from '../services/ModelService';
export class User {
    who;
    isMobile;
    authService;
    browserService;
    models = ModelService.getInstance();
    player;
    constructor(who, isMobile = false) {
        this.who = who;
        this.isMobile = isMobile;
        const sanitizedWho = sanitizer(who);
        this.browserService = new BrowserService(sanitizedWho, isMobile);
        this.authService = new AuthService(sanitizedWho, isMobile, this.browserService);
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
        const userId = await this.authService.login(mail, password, cookies);
        await this.browserService.closeContext();
        invariant(userId, 'Login failed');
        this.player = await this.models.getPlayer(userId);
        return userId;
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
        const result = await fetch(this.link + url + '?c=' + this.c_html, {
            headers: {
                Cookie: this.cookies,
            },
        }).then((res) => res.text());
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return result;
    }
}
