import { Browser, BrowserContext, Page } from 'playwright';

export const iPhoneUserAgent =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/129.0 Mobile/15E148 Safari/605.1.15';
const mobileViewport = {
  width: 430,
  height: 932,
};

export class contextService {
  public context!: BrowserContext;
  public page!: Page;

  constructor(private browser: Browser, private isMobile: boolean) {}

  get link() {
    return `https://${this.isMobile ? 'm.' : ''}rivalregions.com`;
  }

  async init() {
    this.context = await this.browser.newContext({
      baseURL: this.link,
      timezoneId: 'UTC',
      locale: 'en-US',
      viewport: this.isMobile ? mobileViewport : undefined,
      userAgent: this.isMobile ? iPhoneUserAgent : undefined,
      hasTouch: this.isMobile,
    });
    this.page = await this.context.newPage();
  }
}
