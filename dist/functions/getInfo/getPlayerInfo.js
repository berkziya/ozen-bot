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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlayerInfo = getPlayerInfo;
const cheerio = __importStar(require("cheerio"));
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const utils_1 = require("../../misc/utils");
const UserHandler_1 = require("../../UserHandler");
const getRegionInfo_1 = require("./getRegionInfo");
async function getPlayerInfo(playerId, force) {
    const user = UserHandler_1.UserHandler.getInstance().getUser();
    (0, tiny_invariant_1.default)(user, 'Failed to get user');
    const player = await user.models.getPlayer(playerId);
    if (!force &&
        player.lastUpdate &&
        Date.now() - player.lastUpdate.getTime() < 2 * 1000) {
        return player;
    }
    const content = await user.get('/slide/profile/' + playerId);
    if (!content || content.length < 150)
        return null;
    player.leaderOfState = null;
    player.econMinisterOfState = null;
    player.foreignMinisterOfState = null;
    player.governorOfAuto = null;
    player.statePermits = new Set();
    player.regionPermits = new Set();
    const $ = cheerio.load(content);
    const nameMatch = $('body > div.margin > h1')
        .text()
        .match(/Profile: (.*)/);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    nameMatch && player.setName(nameMatch[1].trim());
    const levelMatch = $('div[action="listed/gain"]')
        .text()
        .match(/Level: (.*)/);
    if (levelMatch) {
        player.level = parseInt(levelMatch[1]);
    }
    const expMatch = $('div[action="listed/gain"]')
        .attr('title')
        .match(/Exp:(.*)Next/);
    if (expMatch) {
        player.exp = (0, utils_1.dotless)(expMatch[1]);
    }
    const leaderDiv = $('h2[title*="eader"]');
    if (leaderDiv.length) {
        const leadingStateId = leaderDiv.attr('action').split('/').pop();
        const leadingState = await user.models.getState(leadingStateId);
        leadingState.name = leaderDiv.text().trim();
        player.setLeader(leadingState);
        if (leaderDiv.attr('title')?.includes('ommand')) {
            leadingState.leaderIsCommander = true;
        }
    }
    const trs = $('tbody > tr');
    for (let i = 1; i < trs.length; i++) {
        const tr = trs.eq(i);
        const key = (0, utils_1.toCamelCase)(tr.find('td').first().text());
        const value = tr.find('td').last().text();
        if (key === 'perks') {
            const perks = value.split(' / ').map((perk) => {
                return parseInt(perk);
            });
            player.perks['str'] = perks[0];
            player.perks['edu'] = perks[1];
            player.perks['end'] = perks[2];
        }
        else if (key === 'region' || key === 'residency') {
            const regionDiv = tr.find('div[action^="map/details/"]').first();
            const regionId = regionDiv.attr('action').split('/').pop();
            const region = await user.models.getRegion(regionId);
            if (key === 'region') {
                player.setRegion(region);
            }
            else {
                player.setResidency(region);
            }
            region.name = regionDiv.text().trim();
        }
        else if (key === 'workPermit') {
            const states = tr.find('[action*="state"]').toArray();
            await Promise.all(states.map(async (el) => {
                const state = await user.models.getState($(el).attr('action').split('/').pop());
                state.name = $(el).text().trim();
                player.addStatePermit(state);
            }));
            const regions = tr.find('[action^="map/details"]').toArray();
            await Promise.all(regions.map(async (el) => {
                const region = await user.models.getRegion($(el).attr('action').split('/').pop());
                region.name = $(el).text().trim();
                player.addRegionPermit(region);
            }));
        }
        else if (key === 'governor' ||
            key === 'ministerOfEconomics' ||
            key === 'economicAdviser' ||
            key === 'foreignMinister') {
            const id = tr
                .find('div[action^="map/"]')
                .attr('action')
                .split('/')
                .pop();
            const name = tr.find('div[action^="map/"]').text().trim();
            switch (key) {
                case 'governor': {
                    const region = await (0, getRegionInfo_1.getRegionInfo)(parseInt(id));
                    const autonomy = region.autonomy;
                    autonomy.name = name;
                    player.setGovernor(autonomy);
                    autonomy.setCapital(region);
                    break;
                }
                case 'ministerOfEconomics':
                case 'economicAdviser': {
                    const econState = await user.models.getState(id);
                    player.setEcon(econState);
                    econState.name = name;
                    break;
                }
                case 'foreignMinister': {
                    const foreignState = await user.models.getState(id);
                    player.setForeign(foreignState);
                    foreignState.name = name;
                    break;
                }
            }
        }
    }
    player.lastUpdate = new Date();
    return player;
}
