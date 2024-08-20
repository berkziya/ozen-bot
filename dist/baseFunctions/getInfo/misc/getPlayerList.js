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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCitizenList = getCitizenList;
exports.getResidentList = getResidentList;
exports.getStateCitizens = getStateCitizens;
exports.getStateResidents = getStateResidents;
exports.getWarDamageList = getWarDamageList;
const cheerio = __importStar(require("cheerio"));
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
async function getWarDamageList(user, id, aggressor) {
    return getPlayerList(user, user.link + `/war/damage/${id}/${aggressor ? 0 : 1}/`);
}
async function getPlayerList(user, link) {
    const players = [];
    while (true) {
        const content = await fetch(link + players.length, {
            headers: {
                cookie: user.cookies,
            },
        }).then((res) => res.text());
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
    console.log(players);
    return players;
}
