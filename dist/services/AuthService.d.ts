import { BrowserService } from './BrowserService';
import { BrowserContext } from 'playwright';
export declare class AuthService {
    private browserService;
    private isMobile;
    cookies: string;
    c_html: string;
    private cookiesDir;
    constructor(browserService: BrowserService, isMobile: boolean);
    get link(): string;
    rememberCookies(context: BrowserContext): Promise<void>;
    login(mail: string, password: string, useCookies?: boolean): Promise<number | null>;
    private amILoggedIn;
}
