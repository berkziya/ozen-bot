import { BrowserService } from './BrowserService';
export declare class AuthService {
    private browserService;
    private isMobile;
    cookies: string;
    c_html: string;
    constructor(browserService: BrowserService, isMobile: boolean);
    get link(): string;
    login(mail: string, password: string, useCookies?: boolean): Promise<number | null>;
    private amILoggedIn;
}
