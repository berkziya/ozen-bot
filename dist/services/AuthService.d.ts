import { BrowserContext } from 'playwright';
import { BrowserService } from './BrowserService';
export declare class AuthService {
    private who;
    private isMobile;
    private browserService;
    cookieDict: [];
    c_html: string;
    constructor(who: string, isMobile: boolean, browserService: BrowserService);
    get cookies(): string;
    get cookiesPath(): string;
    saveCookies(source: BrowserContext | string): Promise<void>;
    amILoggedIn(): Promise<boolean>;
    login(mail?: string, password?: string, cookies?: string): Promise<number | null>;
}
