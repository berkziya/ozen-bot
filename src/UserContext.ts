import { Browser } from 'playwright';
import AsyncLock from 'async-lock';
import { AuthService } from './services/AuthService';
import invariant from 'tiny-invariant';
import { contextService } from './services/ContextService';
import ModelService from './services/ModelService';
import { Player } from './entity/Player';

export class UserContext {
  private authService: AuthService;
  private browserService: contextService;

  public models: ModelService = ModelService.getInstance();
  public lock = new AsyncLock({ domainReentrant: true });

  public player!: Player;
  public id!: number;

  constructor(browser: Browser, public isMobile: boolean) {
    this.browserService = new contextService(browser, isMobile);
    this.authService = new AuthService(this.browserService, isMobile);
  }

  get link() {
    return this.browserService.link;
  }

  get cookies() {
    return this.authService.cookies;
  }

  async init() {
    await this.browserService.init();
  }

  async login(mail: string, password: string, useCookies: boolean = true) {
    return await this.lock.acquire(['context', 'page'], async () => {
      const resultId = await this.authService.login(mail, password, useCookies);
      if (resultId) {
        this.player = await this.models.getPlayer(resultId);
        this.id = resultId;
      }
      return resultId;
    });
  }

  async ajax(url: string, data: string = '') {
    const { page } = this.browserService;
    return await this.lock.acquire(['context', 'page'], async () => {
      await this.internetIsOn();
      const jsAjax = `
      $.ajax({
        url: '${url}',
        data: { c: c_html, ${data} },
        type: 'POST',
      });`;
      return await page.evaluate(jsAjax);
    });
  }

  async get(url: string) {
    const { context } = this.browserService;
    return await this.lock.acquire(['context', 'page'], async () => {
      await this.internetIsOn();
      const page = await context.newPage();
      await page.goto(url, { waitUntil: 'load' });
      const content = await page.content();
      await page.close();
      return { content };
    });
  }

  async internetIsOn() {
    const { page } = this.browserService;
    try {
      invariant(
        await page.evaluate(() => window.navigator.onLine),
        'No internet connection'
      );
      return true;
    } catch (e) {
      console.error('Internet is off:', e);
      return false;
    }
  }
}
