"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.internetIsOn = internetIsOn;
exports.default = imAlive;
async function internetIsOn(user) {
    return await user.page.evaluate(() => {
        return new Promise((resolve) => {
            if (navigator.onLine) {
                resolve(true);
            }
            else {
                window.addEventListener('online', () => resolve(true));
            }
        });
    });
}
async function imAlive(user) {
    return await user.lock.acquire(['page', 'context'], async () => {
        try {
            if (!internetIsOn(user)) {
                throw new Error('No internet connection');
            }
            return await user.page.evaluate(() => {
                return id;
            });
        }
        catch (e) {
            console.error(e);
            return null;
        }
    });
}
