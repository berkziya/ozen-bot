import { firefox, Browser } from 'playwright';
import { UserContext } from './UserContext';
import invariant from 'tiny-invariant';
import { promises as fs } from 'node:fs';
import { ModelService } from './services/ModelService';
import path from 'node:path';

export const cookiesDir = path.join(process.cwd(), 'cookies');

export class Client {
  public browser!: Browser;

  public modelService: ModelService = ModelService.getInstance();
  public users: Set<UserContext> = new Set();

  async init({
    headless = true,
  }: { headless?: boolean } = {}): Promise<Browser | null> {
    try {
      this.browser = await firefox.launch({
        headless,
        slowMo: 1000,
      });
      if (!this.browser) {
        throw new Error('Browser not initialized');
      }
      return this.browser;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async isClientValid(): Promise<boolean> {
    try {
      invariant(this.browser, 'Can not find the browser');
      return true;
    } catch (e) {
      console.error('Context validation failed:', e);
      return false;
    }
  }

  async createUserContext({
    isMobile = false,
  }: { isMobile?: boolean } = {}): Promise<UserContext | null> {
    try {
      const userContext = new UserContext(this.browser, isMobile);
      this.users.add(userContext);
      return userContext;
    } catch (e) {
      console.error('Failed to create user context:', e);
      return null;
    }
  }

  async autoCreateContexts() {
    const jsonFiles = (await fs.readdir(cookiesDir)).filter((file) =>
      file.endsWith('.json')
    );

    for (const file of jsonFiles) {
      const filePath = path.join(cookiesDir, file);
      const fileContents = await fs.readFile(filePath, 'utf-8');
      const user = await this.createUserContext();
      const id = await user?.login(
        file.split('-')[0],
        null,
        true,
        fileContents
      );
      if (id) this.users.add(user!);
    }
  }
}
