import path from 'node:path';
import { BrowserContext, firefox, Page } from 'playwright';
import { browserDir } from '../UserHandler';

export const iPhoneUserAgent =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/130.0 Mobile/15E148 Safari/605.1.15';
const mobileViewport = { width: 430, height: 932 };

export class BrowserService {
  private context!: BrowserContext;
  private page!: Page;

  constructor(private who: string, private isMobile: boolean) {}

  get link() {
    return `https://${this.isMobile ? 'm.' : ''}rivalregions.com`;
  }

  async getPage() {
    if (!this.context)
      this.context = await firefox.launchPersistentContext(
        path.join(browserDir, this.who),
        {
          headless: true,
          timezoneId: 'UTC',
          locale: 'en-US',
          viewport: this.isMobile ? mobileViewport : undefined,
          userAgent: this.isMobile ? iPhoneUserAgent : undefined,
          hasTouch: this.isMobile,
        }
      );
    this.page = this.context.pages()[0];
    await this.page.goto(this.link);
    return { page: this.page, context: this.context };
  }

  async closePage() {
    if (this.context) await this.context.close();
  }
}
