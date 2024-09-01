import { contextService } from './ContextService';
export declare class AuthService {
    private contextService;
    private isMobile;
    cookies: string;
    constructor(contextService: contextService, isMobile: boolean);
    login(mail: string, password: string, useCookies?: boolean): Promise<number | null>;
    private amILoggedIn;
}
