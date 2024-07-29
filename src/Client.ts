import {
  chromium,
  firefox,
  Browser,
  BrowserContext,
  Page,
  BrowserContextOptions,
} from 'playwright';
import AsyncLock from 'async-lock';
import { Player } from './entity/Player';

import { promises as fs } from 'node:fs';
import path from 'node:path';

const iPhoneUserAgent =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 14_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/128.0 Mobile/15E148 Safari/605.1.15';
const mobileViewport = {
  width: 430,
  height: 932,
};

export class UserContext {
  constructor(private browser: Browser, public mobile: boolean) {}

  public context!: BrowserContext;
  public page!: Page;

  public id!: number;
  public player!: Player;

  public lock = new AsyncLock();

  async init() {
    await this.lock.acquire(['context', 'page'], async () => {
      const contextOptions: BrowserContextOptions = {
        baseURL: 'https://rivalregions.com',
        timezoneId: 'UTC',
        locale: 'en-US',
        viewport: this.mobile ? mobileViewport : undefined,
        userAgent: this.mobile ? iPhoneUserAgent : undefined,
        isMobile: this.mobile,
        hasTouch: this.mobile,
      };

      this.context = await this.browser.newContext(contextOptions);
      this.page = await this.context.newPage();
    });
  }

  async amILoggedIn() {
    try {
      await this.page.waitForSelector('#chat_send');
      return true;
    } catch (e) {
      return false;
    }
  }

  async login(
    mail: string,
    password: string,
    useCookies: boolean = true
  ): Promise<number | null> {
    return this.lock.acquire(['context', 'page'], async () => {
      try {
        await this.page.goto('/');

        const sanitizedMail = mail.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const cookiesPath = path.resolve(
          __dirname,
          '../../..',
          `${sanitizedMail}_${this.mobile ? 'mobile_' : ''}cookies.json`
        );

        if (useCookies) {
          try {
            await fs.access(cookiesPath);
            const cookiesData = await fs.readFile(cookiesPath, 'utf8');
            const cookies = JSON.parse(cookiesData);
            await this.page.context().addCookies(cookies);
            await this.page.reload();
          } catch (error: any) {
            if (error.code !== 'ENOENT') {
              throw error;
            }
            // File doesn't exist, proceed without cookies
            useCookies = false;
          }
        }

        if (!useCookies) {
          await this.page.fill('input[name="mail"]', mail);
          await this.page.fill('input[name="p"]', password);
          await this.page.click('input[name="s"]');
        }

        if (!(await this.amILoggedIn())) {
          if (useCookies) {
            return this.login(mail, password, false);
          }
          return null;
        }

        this.id = await this.page.evaluate(() => {
          // @ts-ignore
          return id;
        });

        // this.player = await this.models.getPlayer(this.id!);

        const cookies = await this.page.context().cookies();
        await fs.writeFile(cookiesPath, JSON.stringify(cookies));

        return this.id;
      } catch (error) {
        console.error(error);
        return null;
      }
    });
  }

  async ajax(url: string, data: string = '') {
    return await this.lock.acquire(['page'], async () => {
      const jsAjax = `
      $.ajax({
        url: '${url}',
        data: { c: c_html, ${data} },
        type: 'POST',
      });`;
      await this.page.evaluate(jsAjax);
    });
  }
}

export class Client {
  private browser!: Browser;

  public users: UserContext[] = [];
  public browserType: 'chromium' | 'firefox' = 'firefox';
  public headless: boolean = false;

  async init() {
    try {
      if (this.browserType === 'chromium') {
        this.browser = await chromium.launch({
          headless: this.headless,
          slowMo: 1000,
        });
      } /*if (this.browserType === 'firefox')*/ else {
        this.browser = await firefox.launch({
          headless: this.headless,
          slowMo: 1000,
        });
      }
      if (!this.browser) {
        throw new Error('Browser not initialized');
      }
      return this.browser;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async createUserContext(mobile: boolean = false): Promise<UserContext> {
    const userContext = new UserContext(this.browser, mobile);
    await userContext.init();
    return userContext;
  }
}
