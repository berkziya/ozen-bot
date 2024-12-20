"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCitizens = getCitizens;
exports.getResidents = getResidents;
exports.getWarDamageList = getWarDamageList;
const cheerio = __importStar(require("cheerio"));
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const State_1 = require("../../../entity/State");
const UserHandler_1 = require("../../../UserHandler");
async function getCitizens(location) {
    const user = UserHandler_1.UserHandler.getInstance().getUser();
    (0, tiny_invariant_1.default)(user, 'Failed to get user');
    return location instanceof State_1.State
        ? getStateCitizens(user, location.id)
        : getCitizenList(user, location.id);
}
async function getResidents(user, location) {
    return location instanceof State_1.State
        ? getStateResidents(user, location.id)
        : getResidentList(user, location.id);
}
async function getCitizenList(user, id) {
    return getPlayerList(user, user.link + `/listed/region/${id}/0/`);
}
async function getResidentList(user, id) {
    return getPlayerList(user, user.link + `/listed/residency/${id}/0/`);
}
async function getStateCitizens(user, id) {
    return getPlayerList(user, user.link + `/listed/state_population/${id}/`);
}
async function getStateResidents(user, id) {
    return getPlayerList(user, user.link + `/listed/residency_state/${id}/0/`);
}
async function getWarDamageList(user, id, defender) {
    return getPlayerList(user, user.link + `/war/damage/${id}/${defender ? 1 : 0}/`);
}
async function getPlayerList(user, link) {
    const players = [];
    while (true) {
        const content = await user.get(link + players.length);
        const $ = cheerio.load(content);
        const playerTrs = $('tr[user]');
        if (playerTrs.length === 0)
            break;
        for (let i = 0; i < playerTrs.length; i++) {
            const playerTr = playerTrs.eq(i);
            const player = {
                id: parseInt(playerTr.attr('user')),
                name: playerTr.find('.list_name').first().text().trim(),
                // accountCreation: new Date(playerTr.find('.list_name').last().attr('rat')!),
                level: parseInt(playerTr.find('.list_level').first().attr('rat')),
                damage: parseInt(playerTr.find('.list_level').last().attr('rat')),
            };
            players.push(player);
        }
    }
    return players;
}
