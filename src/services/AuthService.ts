import { BrowserService } from './BrowserService';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { BrowserContext, Page } from 'playwright';
import invariant from 'tiny-invariant';
import { cookiesDir } from '../Client';

export class AuthService {
  private mail!: string;
  public cookieDict!: [];
  public c_html!: string;

  constructor(
    private browserService: BrowserService,
    private isMobile: boolean
  ) {}

  get link() {
    return `https://${this.isMobile ? 'm.' : ''}rivalregions.com`;
  }

  get cookies() {
    return this.cookieDict
      .map((x: { name: string; value: string }) => `${x.name}=${x.value}`)
      .join('; ');
  }

  get cookiesPath() {
    const sanitizedMail = this.mail.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    return path.join(
      cookiesDir,
      `${sanitizedMail}-${this.isMobile ? 'm_' : ''}cookies.json`
    );
  }

  async saveCookies(source: BrowserContext | string) {
    if (!(typeof source === 'string'))
      source = JSON.stringify(await source.cookies());
    this.cookieDict = JSON.parse(source);
    await fs.mkdir(cookiesDir, { recursive: true });
    await fs.writeFile(this.cookiesPath, source);
  }

  async login(
    mail: string,
    password?: string | null,
    useCookies: boolean = true,
    cookies?: string,
    close: boolean = true
  ): Promise<{ id: number | null; page: Page | null }> {
    this.mail = mail;
    try {
      const { page, context } = await this.browserService.getPage();
      await page.goto(this.link);

      if (useCookies) {
        try {
          await fs.access(this.cookiesPath);
          const cookiesData = await fs.readFile(this.cookiesPath, 'utf8');
          const cookies = JSON.parse(cookiesData);
          await page.context().addCookies(cookies);
          await page.reload();
        } catch {
          if (cookies) await this.saveCookies(cookies);
          else useCookies = false;
        }
      }

      if (!useCookies) {
        invariant(password, 'No password given');
        await page.fill('input[name="mail"]', mail);
        await page.fill('input[name="p"]', password);
        await page.click('input[name="s"]');
      }

      await page.waitForSelector('#chat_send');

      await this.saveCookies(context);

      if (!(await this.amILoggedIn())) {
        if (useCookies && password) {
          return this.login(mail, password, false);
        } else {
          throw new Error('Failed to login');
        }
      }

      const id: number = await page.evaluate(() => id);

      invariant(id, 'Failed to get player id');

      const c_html: string = await page.evaluate(() => c_html);
      this.c_html = c_html;

      return { id, page };
    } catch (e) {
      console.error('Failed to login:', e);
      close = true;
      return { id: null, page: null };
    } finally {
      if (close) await this.browserService.closePage();
    }
  }

  private async amILoggedIn() {
    try {
      const x = await fetch(this.link + '/map/details/100002', {
        headers: { cookie: this.cookies },
      });

      invariant(x.status == 200, 'No response from the server');

      const content = await x.text();
      invariant(content.length > 150, 'Player is not logged in');

      this.c_html = content.match(/c_html = '([a-f0-9]{32})';/)![1];

      return true;
    } catch (e) {
      console.error('Failed to check if player is logged in:', e);
      return false;
    }
  }
}
