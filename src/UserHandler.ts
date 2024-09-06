import { User } from './User';
import { promises as fs } from 'node:fs';
import { ModelService } from './services/ModelService';
import path from 'node:path';

export const cookiesDir = path.join(process.cwd(), 'cookies');
export const browserDir = path.join(process.cwd(), 'browsers');

export class UserHandler {
  private static instance: UserHandler;

  public modelService: ModelService = ModelService.getInstance();
  public users: Set<User> = new Set();

  private constructor() {}

  static getInstance(): UserHandler {
    if (!UserHandler.instance) {
      UserHandler.instance = new UserHandler();
    }
    return UserHandler.instance;
  }

  getUser(id?: number, who?: string): User | undefined {
    if (id) return [...this.users].find((u) => u.id === id);
    if (who) return [...this.users].find((u) => u.who === who);
    const random = Math.floor(Math.random() * this.users.size);
    return [...this.users][random];
  }

  async createUser(
    who: string,
    mail?: string,
    password?: string,
    cookies?: string
  ) {
    const user = new User(who);
    const id = await user.init(mail, password, cookies);
    if (id) this.users.add(user);
    return user;
  }

  async autoCreateUsers() {
    const jsonFiles = (await fs.readdir(cookiesDir)).filter((file) =>
      file.endsWith('.json')
    );

    for (const file of jsonFiles) {
      const filePath = path.join(cookiesDir, file);
      const fileContents = await fs.readFile(filePath, 'utf-8');
      const who = file.split('-')[0];
      await this.createUser(who, undefined, undefined, fileContents);
    }
  }
}
