import { promises as fs } from 'node:fs';
import path from 'node:path';
import { BrowserContext } from 'playwright';
import invariant from 'tiny-invariant';
import { cookiesDir } from '../UserHandler';
import { sanitizer } from '../misc/sanitizer';
import { BrowserService } from './BrowserService';

export class AuthService {
  public cookieDict!: [];
  public c_html!: string;

  constructor(
    private who: string,
    private isMobile: boolean,
    private browserService: BrowserService
  ) {
    this.who = sanitizer(who);
  }

  get cookies() {
    return this.cookieDict
      .map((x: { name: string; value: string }) => `${x.name}=${x.value}`)
      .join('; ');
  }

  get cookiesPath() {
    return path.join(
      cookiesDir,
      `${this.who}-${this.isMobile ? 'm_' : ''}cookies.json`
    );
  }

  async saveCookies(source: BrowserContext | string) {
    if (!(typeof source === 'string'))
      source = JSON.stringify(await source.cookies());
    this.cookieDict = JSON.parse(source);
    await fs.mkdir(cookiesDir, { recursive: true });
    await fs.writeFile(this.cookiesPath, source);
  }

  public async amILoggedIn() {
    try {
      const x = await fetch(this.browserService.link + '/map/details/100002', {
        headers: { cookie: this.cookies },
      });
      invariant(x.status == 200, 'No response from the server');

      const content = await x.text();
      invariant(content.length > 150, 'Player is not logged in');

      this.c_html = content.match(/c_html = '([a-f0-9]{32})';/)![1];
      return true;
    } catch {
      return false;
    }
  }

  async login(
    mail?: string,
    password?: string,
    cookies?: string
  ): Promise<number | null> {
    try {
      const { page, context } = await this.browserService.getPage();

      const onSuccess = async () => {
        this.saveCookies(context);
        const id: number = await page.evaluate(() => id);
        const c_html: string = await page.evaluate(() => c_html);
        this.c_html = c_html;
        return id;
      };

      try {
        // check if already logged in
        const id: number = await page.evaluate(() => id);
        if (id) return onSuccess();
      } catch {}

      try {
        await fs.access(this.cookiesPath);
        const cookiesData = await fs.readFile(this.cookiesPath, 'utf8');
        const cookies = JSON.parse(cookiesData);
        await page.context().addCookies(cookies);
        await page.reload();
        await page.waitForSelector('#header_content', { timeout: 5000 });
        return onSuccess();
      } catch {}

      if (mail && password) {
        try {
          await page.fill('input[name="mail"]', mail);
          await page.fill('input[name="p"]', password);
          await page.click('input[name="s"]');
          await page.waitForSelector('#header_content', { timeout: 5000 });
          return onSuccess();
        } catch {}
      }

      if (cookies) {
        try {
          await page.context().addCookies(JSON.parse(cookies));
          await page.reload();
          await page.waitForSelector('#header_content', { timeout: 5000 });
          return onSuccess();
        } catch {}
      }

      return null;
    } catch (e) {
      console.error('Failed to login:', e);
      return null;
    }
  }
}
