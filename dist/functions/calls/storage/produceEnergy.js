"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.produceEnergy = produceEnergy;
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const storageInfo_1 = require("../../getInfo/misc/storageInfo");
async function produceEnergy(user, amount, target, leaveAtLeastXGold = 0) {
    try {
        if (target) {
            const storage = await (0, storageInfo_1.storageInfo)(user);
            (0, tiny_invariant_1.default)(storage, 'Failed to get storage info');
            const currentEnergy = user.player.storage.energyDrink;
            amount = target - currentEnergy;
        }
        (0, tiny_invariant_1.default)(amount, 'No amount specified');
        const currentGold = user.player.storage.gold;
        amount = Math.min(amount, (currentGold - leaveAtLeastXGold) * 10);
        amount = Math.floor(amount / 10) * 10;
        (0, tiny_invariant_1.default)(amount > 100, 'Invalid amount');
        return await user.ajax(`/storage/newproduce/17/${amount}`);
    }
    catch (e) {
        console.error(e);
        return null;
    }
}
