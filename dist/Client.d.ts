import { Browser, BrowserContext, Page } from 'playwright';
import AsyncLock from 'async-lock';
import { Player } from './entity/Player';
import ModelHandler from './ModelHandler';
/**
 * Represents the user context for interacting with the browser and web pages.
 */
export declare class UserContext {
    private browser;
    mobile: boolean;
    models: ModelHandler;
    /**
     * Creates an instance of UserContext.
     * @param browser The browser instance.
     * @param mobile Indicates whether the user is on a mobile device.
     */
    constructor(browser: Browser, mobile: boolean, models: ModelHandler);
    /**
     * The browser context.
     */
    context: BrowserContext;
    /**
     * The web page.
     */
    page: Page;
    /**
     * The user ID.
     */
    id: number;
    /**
     * The player information.
     */
    player: Player;
    /**
     * The async lock for synchronizing access to context and page.
     */
    lock: AsyncLock;
    cookie: string;
    /**
     * Initializes the user context by creating a new browser context and page.
     */
    init(): Promise<void>;
    /**
     * Checks if the user is logged in.
     * @returns A boolean indicating whether the user is logged in.
     */
    amILoggedIn(): Promise<boolean>;
    /**
     * Logs in the user with the specified email and password.
     * @param mail The user's email.
     * @param password The user's password.
     * @param useCookies Indicates whether to use cookies for login.
     * @returns The user ID if login is successful, otherwise null.
     */
    login(mail: string, password: string, useCookies?: boolean): Promise<number | null>;
    /**
     * Sends an AJAX request to the specified URL with optional data.
     * @param url The URL to send the AJAX request to.
     * @param data The additional data to include in the request.
     */
    ajax(url: string, data?: string): Promise<void>;
    get(url: string): Promise<{
        content: string;
    }>;
}
/**
 * Represents a client that interacts with a browser and manages user contexts.
 */
export declare class Client {
    private browser;
    models: ModelHandler;
    users: Set<UserContext>;
    browserType_: import("playwright").BrowserType<{}>;
    /**
     * Represents a client object.
     * @constructor
     * @param {Object} options - The options for the client.
     * @param {string} options.browserType - The type of browser to use (optional, defaults to 'firefox').
     */
    constructor({ browserType, }?: {
        browserType?: 'chromium' | 'firefox';
    });
    /**
     * Initializes the browser instance.
     * @param headless - Whether to run the browser in headless mode. Defaults to true.
     * @returns A promise that resolves to the initialized browser instance, or null if initialization fails.
     */
    init(headless?: boolean): Promise<Browser | null>;
    /**
     * Creates a user context within the client's browser.
     * @param mobile - Indicates whether the user context should simulate a mobile device.
     * @returns A promise that resolves to the created UserContext instance.
     */
    createUserContext({ mobile, }?: {
        mobile?: boolean;
    }): Promise<UserContext>;
}
