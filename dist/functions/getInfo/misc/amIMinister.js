"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.amIMinister = amIMinister;
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const getPlayerInfo_1 = require("../getPlayerInfo");
const getRegionInfo_1 = require("../getRegionInfo");
async function amIMinister(playerId) {
    const player = await (0, getPlayerInfo_1.getPlayerInfo)(playerId);
    (0, tiny_invariant_1.default)(player, 'Failed to get player info');
    const region = await (0, getRegionInfo_1.getRegionInfo)(player.region.id);
    (0, tiny_invariant_1.default)(region, 'Failed to get region info');
    const toBeReturned = {
        leader: false,
        dicta: false,
        econ: false,
        foreign: false,
        governor: false,
    };
    toBeReturned.leader =
        (player.leaderOfState &&
            player.leaderOfState.id === player.region.state?.id) ??
            false;
    if (toBeReturned.leader)
        toBeReturned.dicta =
            player.leaderOfState?.governmentForm === 'dictatorship';
    toBeReturned.econ =
        (player.econMinisterOfState &&
            player.econMinisterOfState.id === player.region.state?.id) ??
            false;
    toBeReturned.foreign =
        (player.foreignMinisterOfState &&
            player.foreignMinisterOfState.id === player.region?.state?.id) ??
            false;
    toBeReturned.governor =
        (player.governorOfAuto &&
            player.governorOfAuto.id === player.region?.autonomy?.id) ??
            false;
    return toBeReturned;
}
