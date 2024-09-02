import { Browser } from 'playwright';
import { ModelService } from './services/ModelService';
import { Player } from './entity/Player';
export declare class UserContext {
    isMobile: boolean;
    private authService;
    private browserService;
    models: ModelService;
    player: Player;
    constructor(browser: Browser, isMobile: boolean);
    get id(): number;
    get link(): string;
    get cookies(): string;
    get c_html(): string;
    login(mail: string, password: string, useCookies?: boolean): Promise<number | null>;
    ajax(url: string, data?: {
        [key: string]: string | number;
    }): Promise<Response>;
    get(url: string): Promise<string>;
}
