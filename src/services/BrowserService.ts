import path from 'path';
import { BrowserContext, firefox, Page } from 'playwright';
import { cookiesDir } from '../user/UserService';

export const iPhoneUserAgent =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/130.0 Mobile/15E148 Safari/605.1.15';
const mobileViewport = { width: 430, height: 932 };

export default class BrowserService {
  private context!: BrowserContext;
  private page!: Page;

  constructor(private who: string, private isMobile: boolean) {}

  get link() {
    return `https://${this.isMobile ? 'm.' : ''}rivalregions.com`;
  }

  async getContext() {
    try {
      if (!this.context) {
        this.context = await firefox.launchPersistentContext(
          path.join(cookiesDir, 'browsers', this.who),
          {
            headless: true,
            timezoneId: 'UTC',
            locale: 'en-US',
            viewport: this.isMobile ? mobileViewport : undefined,
            userAgent: this.isMobile ? iPhoneUserAgent : undefined,
            hasTouch: this.isMobile,
          }
        );
      }
      return { context: this.context };
    } catch (e) {
      console.log('Error launching context', e);
      return null;
    }
  }

  async getPage() {
    await this.getContext();
    try {
      this.page = this.context.pages()[0] || (await this.context.newPage());
      await this.page.goto(this.link);
      return { page: this.page, context: this.context };
    } catch (e) {
      console.log('Error getting page', e);
      return null;
    }
  }

  async closeContext() {
    try {
      if (this.context) await this.context.close();
    } catch (e) {
      console.log('Error closing context', e);
    }
  }
}
