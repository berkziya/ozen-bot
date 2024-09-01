"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.proLawByText = proLawByText;
exports.proLaw = proLaw;
exports.cancelSelfLaw = cancelSelfLaw;
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const getStateInfo_1 = require("../../getInfo/getStateInfo");
const getParliamentInfo_1 = require("../../getInfo/misc/getParliamentInfo");
async function proLawByText(user, text) {
    try {
        await (0, getStateInfo_1.getStateInfo)(user, user.player.region.state.id, true);
        const capitalId = user.player.region.state.capital.id;
        const parliament = await (0, getParliamentInfo_1.getParliamentInfo)(user, capitalId);
        (0, tiny_invariant_1.default)(parliament, 'Failed to get parliament info');
        let isAccepted = false;
        for (const law of parliament.laws) {
            if (law.text.includes(text)) {
                await proLaw(user, capitalId, law);
                isAccepted = true;
                break;
            }
        }
        return isAccepted;
    }
    catch (e) {
        console.error(e);
        return null;
    }
}
async function proLaw(user, capitalId, law) {
    return await user.ajax(`/parliament/votelaw/${capitalId}/${law.by.id}/${law.id}/pro`);
}
async function cancelSelfLaw(user) {
    return await user.ajax('/parliament/removelaw');
}
