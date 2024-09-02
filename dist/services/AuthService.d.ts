import { BrowserService } from './BrowserService';
import { BrowserContext } from 'playwright';
export declare class AuthService {
    private browserService;
    private isMobile;
    private mail;
    cookieDict: [];
    c_html: string;
    constructor(browserService: BrowserService, isMobile: boolean);
    get link(): string;
    get cookies(): string;
    get cookiesPath(): string;
    saveCookies(source: BrowserContext | string): Promise<void>;
    login(mail: string, password?: string | null, useCookies?: boolean, cookies?: string): Promise<number | null>;
    private amILoggedIn;
}
