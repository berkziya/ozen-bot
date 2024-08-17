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
exports.mainPageInfo = mainPageInfo;
const cheerio = __importStar(require("cheerio"));
const utils_1 = require("../../../misc/utils");
const timestamps_1 = require("../../../misc/timestamps");
async function mainPageInfo(user) {
    const x = await fetch('https://rivalregions.com/main/content', {
        headers: { cookie: user.cookies },
    });
    const content = await x.text();
    if (!content || content.length < 150)
        return null;
    const $ = cheerio.load(content);
    const toBeReturned = {};
    // Get data from scripts
    $('script').each((_i, el) => {
        const script = $(el).html();
        if (script) {
            const trainingWarId = script.match(/slide_header\('war\/details\/(\d+)/);
            if (trainingWarId)
                toBeReturned['trainingWarId'] = trainingWarId[1];
            const playerId = script.match(/slide_header\('slide\/profile\/(\d+)/);
            if (playerId)
                toBeReturned['playerId'] = playerId[1];
            const hitCountdownSeconds = script.match(/\.war_index_war_countdown'\)\.countdown\({\s*until:\s*(\d+)/);
            if (hitCountdownSeconds)
                toBeReturned['hitCountdown'] = parseInt(hitCountdownSeconds[1]);
            const money = script.match(/new_m\('([0-9.]+)'\);/);
            if (money) {
                toBeReturned['money'] = (0, utils_1.dotless)(money[1]);
                user.player.storage.money = (0, utils_1.dotless)(money[1]);
            }
            const gold = script.match(/new_g\('([0-9.]+)'\);/);
            if (gold) {
                toBeReturned['gold'] = (0, utils_1.dotless)(gold[1]);
                user.player.storage.gold = (0, utils_1.dotless)(gold[1]);
            }
            const upgradingPerk = script.match(/\.perk_square_f\[perk="(\d)/);
            if (upgradingPerk) {
                toBeReturned['upgradingPerk'] = upgradingPerk[1];
                const remainingPerkTime = script.match(/#perk_counter_2'\)\.countdown\({\w*until:\w*(\d+)/);
                if (remainingPerkTime)
                    toBeReturned['remainingPerkTime'] = parseInt(remainingPerkTime[1]);
            }
            else {
                toBeReturned['upgradingPerk'] = null;
            }
        }
    });
    // Current state
    const stateDiv = $('#index_region > div:nth-child(2) > div[action^="map/state_details/"]');
    const stateId = stateDiv.attr('action').split('/').pop();
    const stateName = stateDiv
        .text()
        .replace('State:', '')
        .trim()
        .replace(/\s+/g, ' ');
    const state = await user.models.getState(stateId);
    state.name = stateName;
    toBeReturned['state'] = state;
    // Current region
    const regionDiv = $('#index_region > div:nth-child(3) > div > span[action^="map/details/"]');
    const regionId = regionDiv.attr('action').split('/').pop();
    const regionName = regionDiv.text().trim();
    const region = await user.models.getRegion(regionId);
    region.name = regionName;
    user.player.setRegion(region);
    region.setState(state);
    toBeReturned['region'] = region;
    // Current auto war
    try {
        const autoWarSpan = $('div.war_index_war > div:nth-child(1) > span:nth-child(4)');
        if (autoWarSpan.text() == 'auto') {
            const autoWarId = autoWarSpan.attr('action').split('/').pop();
            toBeReturned['autoWarId'] = autoWarId;
        }
    }
    catch {
        toBeReturned['autWarId'] = null;
    }
    const index_regionDiv = $('#index_region');
    // Am I moving?
    try {
        const movingDiv = index_regionDiv.find('div.small.white > div');
        const movingText = movingDiv.text().replace('back', 'back ');
        const timestamp = (0, timestamps_1.getTimestamp)(movingText);
        if (movingText.includes('Moving in')) {
            toBeReturned['moving'] = true;
            toBeReturned['movingToId'] = movingDiv
                .find('span')
                .attr('action')
                .split('/')
                .pop();
            toBeReturned['movingTime'] = timestamp;
        }
        else if (movingText.includes('Travelling back')) {
            toBeReturned['movingBack'] = true;
            toBeReturned['movingBackTime'] = timestamp;
        }
    }
    catch {
        toBeReturned['moving'] = false;
        toBeReturned['movingBack'] = false;
    }
    // Not residency
    if (index_regionDiv.text().includes('Request residency')) {
        toBeReturned['notResidency'] = true;
    }
    // Level
    const levelDiv = $('span[id="index_exp_level"]');
    const level = parseInt(levelDiv.text());
    toBeReturned['level'] = level;
    // Experience
    const experienceDiv = $('span[id="index_exp_points"]');
    const experience = (0, utils_1.dotless)(experienceDiv.text());
    toBeReturned['experience'] = experience;
    // STR
    const strDiv = $('div[addtitle^="Affects y"]');
    const str = parseInt(strDiv.text());
    toBeReturned['str'] = str;
    // EDU
    const eduDiv = $('div[addtitle^="Affects w"]');
    const edu = parseInt(eduDiv.text());
    toBeReturned['end'] = edu;
    // END
    const endDiv = $('div[addtitle^="D"]');
    const end = parseInt(endDiv.text());
    toBeReturned['edu'] = end;
    return toBeReturned;
}
