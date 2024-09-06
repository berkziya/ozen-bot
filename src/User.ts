import invariant from 'tiny-invariant';
import { Player } from './entity/Player';
import { sanitizer } from './misc/sanitizer';
import { AuthService } from './services/AuthService';
import { BrowserService } from './services/BrowserService';
import { ModelService } from './services/ModelService';

export class User {
  private authService: AuthService;
  private browserService: BrowserService;
  public models = ModelService.getInstance();
  public player!: Player;

  constructor(public who: string, public isMobile: boolean = false) {
    const sanitizedWho = sanitizer(who);
    this.browserService = new BrowserService(sanitizedWho, isMobile);
    this.authService = new AuthService(
      sanitizedWho,
      isMobile,
      this.browserService
    );
  }

  get id() {
    return this.player.id;
  }

  get link() {
    return this.browserService.link;
  }

  get cookies() {
    return this.authService.cookies;
  }

  get c_html() {
    return this.authService.c_html;
  }

  async init(mail?: string, password?: string, cookies?: string) {
    const result = await this.authService.login(mail, password, cookies);
    invariant(result, 'Login failed');
    this.player = await this.models.getPlayer(result);
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
