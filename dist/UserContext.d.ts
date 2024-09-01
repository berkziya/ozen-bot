import { Browser } from 'playwright';
import AsyncLock from 'async-lock';
import ModelService from './services/ModelService';
import { Player } from './entity/Player';
export declare class UserContext {
    isMobile: boolean;
    private authService;
    private browserService;
    models: ModelService;
    lock: AsyncLock;
    player: Player;
    id: number;
    constructor(browser: Browser, isMobile: boolean);
    get link(): string;
    get cookies(): string;
    init(): Promise<void>;
    login(mail: string, password: string, useCookies?: boolean): Promise<number | null>;
    ajax(url: string, data?: string): Promise<unknown>;
    get(url: string): Promise<{
        content: string;
    }>;
    internetIsOn(): Promise<boolean>;
}
