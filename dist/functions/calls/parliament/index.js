"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resourceIds = void 0;
exports.proLawByText = proLawByText;
exports.proLaw = proLaw;
exports.cancelSelfLaw = cancelSelfLaw;
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const getStateInfo_1 = require("../../getInfo/getStateInfo");
const getParliamentInfo_1 = require("../../getInfo/misc/getParliamentInfo");
exports.resourceIds = {
    money: 1,
    gold: 0,
    oil: 3,
    ore: 4,
    uranium: 11,
    diamonds: 15,
};
async function proLawByText(user, text) {
    await (0, getStateInfo_1.getStateInfo)(user.player.region.state.id);
    const capital = user.player.region.state.capital;
    const parliament = await (0, getParliamentInfo_1.getParliamentInfo)(capital);
    (0, tiny_invariant_1.default)(parliament, 'Failed to get parliament info');
    let isAccepted = false;
    for (const law of parliament.laws) {
        if (law.text.includes(text)) {
            await proLaw(user, capital, law);
            isAccepted = true;
            break;
        }
    }
    return isAccepted;
}
async function proLaw(user, capital, law) {
    return await user.ajax(`/parliament/votelaw/${capital.id}/${law.by.id}/${law.id}/pro`);
}
async function cancelSelfLaw(user) {
    return await user.ajax('/parliament/removelaw');
}
