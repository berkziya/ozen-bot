import {
  chromium,
  firefox,
  Browser,
  BrowserContext,
  Page,
  BrowserContextOptions,
} from 'playwright';
import AsyncLock from 'async-lock';
import fs from 'fs';
import path from 'path';
import { Player } from '../../entity/Player';

const iPhoneUserAgent =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/127.0 Mobile/15E148 Safari/605.1.15';
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
        // isMobile: mobile,
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
    cookies: boolean = true
  ): Promise<number | null> {
    return await this.lock.acquire(['context', 'page'], async () => {
      try {
        await this.page.goto('/');
        const sanitizedMail = mail.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const cookiesPath = path.resolve(
          __dirname,
          '../../..',
          `${sanitizedMail}_${this.mobile ? 'mobile_' : ''}cookies.json`
        );
        if (cookies && fs.existsSync(cookiesPath)) {
          const cookies = JSON.parse(fs.readFileSync(cookiesPath, 'utf8'));
          await this.page.context().addCookies(cookies);
          this.page.reload();
        } else {
          cookies = false;
          await this.page.fill('input[name="mail"]', mail);
          await this.page.fill('input[name="p"]', password);
          await this.page.click('input[name="s"]');
        }
        if (!(await this.amILoggedIn())) {
          if (cookies) {
            return await this.login(mail, password, false);
          }
          return null;
        }
        let id: number;
        this.id = await this.page.evaluate(() => {
          return id;
        });
        // this.player = await this.models.getPlayer(this.id!);
        fs.writeFileSync(
          cookiesPath,
          JSON.stringify(await this.page.context().cookies())
        );
        return this.id;
      } catch (e) {
        console.error(e);
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
