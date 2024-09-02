import { firefox, Browser } from 'playwright';
import { UserContext } from './UserContext';
import invariant from 'tiny-invariant';
import { ModelService } from './services/ModelService';

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
}
