import { Player } from '../entity';
import ModelService from '../services/ModelService';
export declare class User {
    who: string;
    isMobile: boolean;
    private authService;
    private browserService;
    models: ModelService;
    player: Player;
    constructor(who: string, isMobile?: boolean);
    get id(): number;
    get link(): string;
    get cookies(): string;
    get c_html(): string;
    amILoggedIn(): Promise<boolean>;
    init(mail?: string, password?: string, cookies?: string): Promise<number>;
    ajax(url: string, data?: {
        [key: string]: string | number;
    }): Promise<Response>;
    get(url: string): Promise<string>;
}
//# sourceMappingURL=User.d.ts.map