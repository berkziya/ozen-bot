import { promises as fs } from 'fs';
import path from 'path';
import ModelService from '../services/ModelService';
import { User } from './User';
export const cookiesDir = path.join(process.cwd(), 'cookies');
export default class UserService {
    static instance;
    modelService = ModelService.getInstance();
    users = [];
    constructor() { }
    static getInstance() {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
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
        const user = existing || new User(who);
        const id = await user.init(mail, password, cookies);
        if (id)
            this.users.push(user);
        return user;
    }
    async autoCreateUsers() {
        const jsonFiles = (await fs.readdir(cookiesDir)).filter((file) => file.endsWith('.json'));
        for (const file of jsonFiles) {
            const filePath = path.join(cookiesDir, file);
            const fileContents = await fs.readFile(filePath, 'utf-8');
            const who = file.split('-')[0];
            await this.createUser(who, undefined, undefined, fileContents);
        }
    }
}
