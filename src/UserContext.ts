import { Browser } from 'playwright';
import { AuthService } from './services/AuthService';
import { BrowserService } from './services/BrowserService';
import { ModelService } from './services/ModelService';
import { Player } from './entity/Player';

export class UserContext {
  private authService: AuthService;
  private browserService: BrowserService;

  public models: ModelService = ModelService.getInstance();
  public player!: Player;

  constructor(browser: Browser, public isMobile: boolean) {
    this.browserService = new BrowserService(browser, isMobile);
    this.authService = new AuthService(this.browserService, isMobile);
  }

  get id() {
    return this.player.id;
  }

  get link() {
    return `https://${this.isMobile ? 'm.' : ''}rivalregions.com`;
  }

  get cookies() {
    return this.authService.cookies;
  }

  get c_html() {
    return this.authService.c_html;
  }

  async login(
    mail: string,
    password?: string | null,
    useCookies: boolean = true,
    cookies?: string
  ) {
    const result = await this.authService.login(
      mail,
      password,
      useCookies,
      cookies
    );
    if (result) this.player = await this.models.getPlayer(result);
    return result;
  }

  async ajax(url: string, data?: { [key: string]: string | number }) {
    const formData = new FormData();
    formData.append('c', this.c_html);

    if (data) {
      for (const [key, value] of Object.entries(data)) {
        formData.append(key, value.toString());
      }
    }

    return await fetch(this.link + url, {
      method: 'POST',
      headers: {
        Cookie: this.cookies,
      },
      body: formData,
    });
  }

  async get(url: string) {
    return await fetch(this.link + url + '?c=' + this.c_html, {
      headers: {
        Cookie: this.cookies,
      },
    }).then((res) => res.text());
  }
}
