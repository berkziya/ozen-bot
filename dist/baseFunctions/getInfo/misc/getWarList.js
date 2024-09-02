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
exports.getWarList = getWarList;
const cheerio = __importStar(require("cheerio"));
async function getWarList(user, stateId) {
    const content = await user.get('/listed/statewars/' + stateId);
    if (!content || content.length < 150)
        return null;
    const $ = cheerio.load(content);
    const wars = new Set();
    async function tdToRegion(td) {
        const regionId = parseInt(td.attr('action').split('/').pop());
        if (!regionId) {
            if (td.text().includes('Coup')) {
                return 'coup';
            }
            return 'revolution';
        }
        const region = await user.models.getRegion(regionId);
        const stateDiv = td.find('div[action^="map/state"]');
        const stateId = parseInt(stateDiv.attr('action').split('/').pop());
        const state = await user.models.getState(stateId);
        const regionName = stateDiv.attr('title');
        const stateName = td.find('span').text().replace(regionName, '').trim();
        region.name = regionName;
        region.setState(state);
        state.name = stateName;
        return region;
    }
    const warTrs = $('tbody > tr');
    for (let i = 0; i < warTrs.length; i++) {
        const warTr = warTrs.eq(i);
        const warId = parseInt(warTr.find('div[url]').attr('url'));
        const war = await user.models.getWar(warId);
        const attackerRegion = await tdToRegion(warTr.find('td[action^="map/details"]').first());
        const defenderRegion = await tdToRegion(warTr.find('td[action^="map/details"]').last());
        war.aggressor = attackerRegion;
        war.defender = defenderRegion;
        if (war.aggressor === 'coup' || war.aggressor === 'revolution') {
            war.type = war.aggressor;
        }
        // war.diff = parseInt(warTr.find('td[rat][action]').first().attr('rat')!);
        war.endingTime = new Date(parseInt(warTr.find('td[rat]').last().attr('rat')));
        wars.add(war);
    }
    return [...wars];
}
