import { BrowserService } from './BrowserService';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import invariant from 'tiny-invariant';

export class AuthService {
  public cookies!: string;
  public c_html!: string;

  constructor(
    private browserService: BrowserService,
    private isMobile: boolean
  ) {}

  get link() {
    return `https://${this.isMobile ? 'm.' : ''}rivalregions.com`;
  }

  async login(
    mail: string,
    password: string,
    useCookies: boolean = true
  ): Promise<number | null> {
    try {
      const page = await this.browserService.getPage();
      await page.goto(this.link);

      const sanitizedMail = mail.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const cookiesDir = path.join(process.cwd(), 'cookies');
      const cookiesPath = path.join(
        cookiesDir,
        `${sanitizedMail}_${this.isMobile ? 'm_' : ''}cookies.json`
      );

      if (useCookies) {
        try {
          await fs.access(cookiesPath);
          const cookiesData = await fs.readFile(cookiesPath, 'utf8');
          const cookies = JSON.parse(cookiesData);
          await page.context().addCookies(cookies);
          await page.reload();
        } catch {
          console.log('Failed to load cookies');
          // File doesn't exist, proceed without cookies
          useCookies = false;
        }
      }

      if (!useCookies) {
        await page.fill('input[name="mail"]', mail);
        await page.fill('input[name="p"]', password);
        await page.click('input[name="s"]');
      }

      await page.waitForSelector('#chat_send');

      if (!(await this.amILoggedIn())) {
        if (useCookies) {
          return this.login(mail, password, false);
        } else {
          throw new Error('Failed to login');
        }
      }

      const id: number = await page.evaluate(() => id);

      invariant(id, 'Failed to get player id');

      const c_html: string = await page.evaluate(() => c_html);
      this.c_html = c_html;

      const cookies = await page.context().cookies();

      // Ensure the directory exists
      await fs.mkdir(cookiesDir, { recursive: true });

      // Write cookies to the file
      await fs.writeFile(cookiesPath, JSON.stringify(cookies));

      return id;
    } catch (e) {
      console.error('Failed to login:', e);
      return null;
    } finally {
      await this.browserService.closePage();
    }
  }

  private async amILoggedIn() {
    const { context } = this.browserService;
    try {
      const cookiesFromContext = await context.cookies();
      this.cookies = cookiesFromContext
        .map((x: any) => `${x.name}=${x.value}`)
        .join('; ');

      const x = await fetch(this.link + '/map/details/100002', {
        headers: { cookie: this.cookies },
      });

      if (x.status !== 200) throw new Error('No response from the server');

      const content = await x.text();
      if (content.length <= 150) throw new Error('Player is not logged in');

      return true;
    } catch (e) {
      console.error('Failed to check if player is logged in:', e);
      return false;
    }
  }
}
