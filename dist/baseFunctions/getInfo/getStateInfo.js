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
exports.getStateInfo = getStateInfo;
const cheerio = __importStar(require("cheerio"));
const utils_1 = require("../../misc/utils");
async function getStateInfo(user, stateId, force) {
    const state = await user.models.getState(stateId);
    if (!force &&
        state.lastUpdate &&
        Date.now() - state.lastUpdate.getTime() < 60 * 10) {
        return state;
    }
    const url = '/map/state_details/' + stateId;
    const { content } = await user.get(url);
    if (!content || content.length < 100) {
        return null;
    }
    // state.image = img;
    const $ = cheerio.load(content);
    state.name = $('body > div.margin > h1 > a').text().trim();
    // state.budget.setBudgetFromDiv($('div.slide_profile_photo > div.imp'));
    async function playerFromDiv(div) {
        const playerDiv = div.find('div[action*="profile"]');
        const player = await user.models.getPlayer(playerDiv.attr('action')?.split('/').pop());
        const playerName = playerDiv.text().match(/([^]*)Wage:/);
        player.setName(playerName ? playerName[1] : player.name);
        return player;
    }
    const divs = $('#region_scroll > div');
    for (let i = 0; i < divs.length; i++) {
        const div = divs.eq(i);
        const key = (0, utils_1.toCamelCase)(div.find('h2').first().text());
        if (key === 'entryFee') {
            const fee = (0, utils_1.dotless)(div.find('div.slide_profile_data > h2').first().text());
            state.entryFee = fee;
        }
        else if (key === 'borders') {
            if (div.text().includes('open')) {
                state.bordersOpen = true;
            }
            else {
                state.bordersOpen = false;
            }
        }
        else if (key === 'residencyForWork') {
            if (div.text().includes('Not')) {
                state.needResidencyToWork = false;
            }
            else {
                state.needResidencyToWork = true;
            }
        }
        else if (key === 'residency') {
            if (div.text().includes('leader')) {
                state.residencyIssuedByLeader = true;
            }
            else {
                state.residencyIssuedByLeader = false;
            }
        }
        else if (key === 'governmentForm') {
            state.governmentForm = (0, utils_1.toCamelCase)(div.find('span').first().text());
        }
        else if (key === 'stateLeader') {
            const leader = await playerFromDiv(div);
            state.setLeader(leader);
        }
        else if (key === 'leaderAndCommander' ||
            key === 'dictator' ||
            key === 'monarch') {
            const leader = await playerFromDiv(div);
            state.setLeader(leader);
            state.leaderIsCommander = true;
        }
        else if (key === 'economicAdviser' || key === 'ministerOfEconomics') {
            const econ = await playerFromDiv(div);
            state.setEconMinister(econ);
        }
        else if (key === 'foreignMinister') {
            const foreign = await playerFromDiv(div);
            state.setForeignMinister(foreign);
        }
        else if (key === 'stateRegions') {
            const regions = div.find('div[action^="map/details/"]').toArray();
            await Promise.all(regions.map(async (el, i) => {
                const region = await user.models.getRegion($(el).attr('action').split('/').pop());
                region.name = $(el).text().trim();
                state.addRegion(region);
                if (i === 0) {
                    state.setCapital(region);
                }
            }));
        }
    }
    return state;
}
