import {
  chromium,
  firefox,
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

const iPhoneUserAgent =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 14_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/128.0 Mobile/15E148 Safari/605.1.15';
const mobileViewport = {
  width: 430,
  height: 932,
};

/**
 * Represents the user context for interacting with the browser and web pages.
 */
export class UserContext {
  /**
   * Creates an instance of UserContext.
   * @param browser The browser instance.
   * @param mobile Indicates whether the user is on a mobile device.
   */
  constructor(
    private browser: Browser,
    public mobile: boolean,
    public models: ModelHandler
  ) {}

  /**
   * The browser context.
   */
  public context!: BrowserContext;

  /**
   * The web page.
   */
  public page!: Page;

  /**
   * The user ID.
   */
  public id!: number;

  /**
   * The player information.
   */
  public player!: Player;

  /**
   * The async lock for synchronizing access to context and page.
   */
  public lock = new AsyncLock();

  /**
   * Initializes the user context by creating a new browser context and page.
   */
  async init() {
    await this.lock.acquire(['context', 'page'], async () => {
      // Context options for the browser context
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

  /**
   * Checks if the user is logged in.
   * @returns A boolean indicating whether the user is logged in.
   */
  async amILoggedIn() {
    try {
      await this.page.waitForSelector('#chat_send');
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  /**
   * Logs in the user with the specified email and password.
   * @param mail The user's email.
   * @param password The user's password.
   * @param useCookies Indicates whether to use cookies for login.
   * @returns The user ID if login is successful, otherwise null.
   */
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

        // @ts-ignore
        this.id = await this.page.evaluate(() => id);

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

  /**
   * Sends an AJAX request to the specified URL with optional data.
   * @param url The URL to send the AJAX request to.
   * @param data The additional data to include in the request.
   */
  async ajax(url: string, data: string = '') {
    return await this.lock.acquire(['context', 'page'], async () => {
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
      await this.page.goto(url);
      return { content: await this.page.content() };
    });
  }
}

/**
 * Represents a client that interacts with a browser and manages user contexts.
 */
export class Client {
  private browser!: Browser;

  public models: ModelHandler = new ModelHandler();
  public users: UserContext[] = [];
  public browserType_;

  /**
   * Represents a client object.
   * @constructor
   * @param {Object} options - The options for the client.
   * @param {string} options.browserType - The type of browser to use (optional, defaults to 'firefox').
   */
  constructor({
    browserType = 'firefox',
  }: { browserType?: 'chromium' | 'firefox' } = {}) {
    this.browserType_ = browserType == 'chromium' ? chromium : firefox;
  }

  /**
   * Initializes the browser instance.
   * @param headless - Whether to run the browser in headless mode. Defaults to true.
   * @returns A promise that resolves to the initialized browser instance, or null if initialization fails.
   */
  async init(headless = true): Promise<Browser | null> {
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

  /**
   * Creates a user context within the client's browser.
   * @param mobile - Indicates whether the user context should simulate a mobile device.
   * @returns A promise that resolves to the created UserContext instance.
   */
  async createUserContext({
    mobile = false,
  }: { mobile?: boolean } = {}): Promise<UserContext> {
    const userContext = new UserContext(this.browser, mobile, this.models);
    await userContext.init();
    this.users.push(userContext);
    return userContext;
  }
}
