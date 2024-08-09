import { chromium, firefox, Browser } from 'playwright';
import ModelHandler from './ModelHandler';
import { UserContext } from './UserContext';

export class Client {
  constructor({
    browserType = 'firefox',
    models = ModelHandler.getInstance(),
  }: { browserType?: 'chromium' | 'firefox'; models?: ModelHandler } = {}) {
    this.browserType_ = browserType == 'chromium' ? chromium : firefox;
    this.models = models;
  }

  private browserType_;
  public browser!: Browser;

  public models: ModelHandler;
  public users: Set<UserContext> = new Set();

  async init({
    headless = true,
  }: { headless?: boolean } = {}): Promise<Browser | null> {
    try {
      this.browser = await this.browserType_.launch({
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

  async createUserContext({
    isMobile = false,
  }: { isMobile?: boolean } = {}): Promise<UserContext> {
    const userContext = new UserContext(this.browser, isMobile, this.models);
    await userContext.init();
    this.users.add(userContext);
    return userContext;
  }
}
