import {
  Browser,
  BrowserContext,
  Page,
  BrowserContextOptions,
} from 'playwright';
import AsyncLock from 'async-lock';
import { promises as fs } from 'node:fs';
import path from 'node:path';

import { Player } from './entity/Player';
import ModelHandler from './ModelHandler';
import invariant from 'tiny-invariant';

export const iPhoneUserAgent =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/129.0 Mobile/15E148 Safari/605.1.15';
const mobileViewport = {
  width: 430,
  height: 932,
};

let id: number;

export class UserContext {
  constructor(
    private browser: Browser,
    public isMobile: boolean,
    public models: ModelHandler
  ) {}

  public context!: BrowserContext;
  public page!: Page;
  public id!: number;
  public player!: Player;
  public lock = new AsyncLock({ domainReentrant: true });
  public cookies = '';

  get link() {
    return `https://${this.isMobile ? 'm.' : ''}rivalregions.com`;
  }

  async init() {
    await this.lock.acquire(['context', 'page'], async () => {
      const contextOptions: BrowserContextOptions = {
        baseURL: this.link,
        timezoneId: 'UTC',
        locale: 'en-US',
        viewport: this.isMobile ? mobileViewport : undefined,
        userAgent: this.isMobile ? iPhoneUserAgent : undefined,
        hasTouch: this.isMobile,
      };

      this.context = await this.browser.newContext(contextOptions);
      this.page = await this.context.newPage();
    });
  }

  async isContextValid(): Promise<boolean> {
    try {
      invariant(this.browser, "Can't find browser");
      invariant(this.context, 'Context is not initialized');
      invariant(this.page, 'Page is not initialized');

      invariant(this.amILoggedIn, 'Player is not logged in');

      return true;
    } catch (e) {
      console.error('Session validation failed:', e);
      return false;
    }
  }

  async amILoggedIn() {
    try {
      const cookiesFromContext = await this.context.cookies();
      this.cookies = cookiesFromContext
        .map((x) => `${x.name}=${x.value}`)
        .join('; ');

      const x = await fetch(this.link + '/map/details/100002', {
        headers: {
          cookie: this.cookies,
        },
      });

      invariant(x.status === 200, 'No response from the server');

      const content = await x.text();
      invariant(content.length > 150, 'Player is not logged in');

      return true;
    } catch (e) {
      console.error('Failed to check if player is logged in:', e);
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
        await this.internetIsOn();
        await this.page.goto('/');

        const sanitizedMail = mail.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const cookiesDir = path.join(__dirname, 'cookies');
        const cookiesPath = path.join(
          cookiesDir,
          `${sanitizedMail}_${this.isMobile ? 'mobile_' : ''}cookies.json`
        );

        if (useCookies) {
          try {
            await fs.access(cookiesPath);
            const cookiesData = await fs.readFile(cookiesPath, 'utf8');
            const cookies = JSON.parse(cookiesData);
            await this.page.context().addCookies(cookies);
            await this.page.reload();
          } catch {
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
          } else {
            throw new Error('Failed to login');
          }
        }

        this.id = await this.page.evaluate(() => id);

        this.player = await this.models.getPlayer(this.id!);

        const cookies = await this.page.context().cookies();

        // Ensure the directory exists
        await fs.mkdir(cookiesDir, { recursive: true });

        // Write cookies to the file
        await fs.writeFile(cookiesPath, JSON.stringify(cookies));

        return this.id;
      } catch (e) {
        console.error('Failed to login:', e);
        return null;
      }
    });
  }

  async ajax(url: string, data: string = '') {
    return await this.lock.acquire(['context', 'page'], async () => {
      await this.internetIsOn();
      const jsAjax = `
      $.ajax({
        url: '${url}',
        data: { c: c_html, ${data} },
        type: 'POST',
      });`;
      await this.page.evaluate(jsAjax);
    });
  }

  async get(url: string) {
    return await this.lock.acquire(['context', 'page'], async () => {
      await this.internetIsOn();
      await this.page.goto(url);
      const content = await this.page.content();
      await this.page.goto(this.link);
      return { content };
    });
  }

  async internetIsOn() {
    // window.navigator.onLine
    // returns true if the browser is online
    try {
      invariant(
        await this.page.evaluate(() => window.navigator.onLine),
        'No internet connection'
      );
      return true;
    } catch (e) {
      console.error('Internet is off:', e);
      return false;
    }
  }
}
