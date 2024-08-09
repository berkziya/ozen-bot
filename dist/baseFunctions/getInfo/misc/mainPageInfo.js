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
async function mainPageInfo(user) {
    const x = await fetch('https://rivalregions.com/main/content', {
        headers: {
            cookie: user.cookies,
        },
    });
    const content = await x.text();
    if (!content || content.length < 100) {
        return null;
    }
    const $ = cheerio.load(content);
    const toBeReturned = {};
    // Get data from scripts
    $('script').each((i, el) => {
        const script = $(el).html();
        if (script) {
            // Get training war id
            const trainingWarId = script.match(/slide_header\('war\/details\/(\d+)/);
            if (trainingWarId) {
                toBeReturned['trainingWarId'] = trainingWarId[1];
            }
            // Current player id
            const playerId = script.match(/slide_header\('slide\/profile\/(\d+)/);
            if (playerId) {
                toBeReturned['playerId'] = playerId[1];
            }
            // Next free hit
            const hitCountdown = script.match(/.war_index_war_countdown/);
            if (hitCountdown) {
                const hitCountdownSeconds = script.match(/until: (\d+)/);
                if (hitCountdownSeconds) {
                    toBeReturned['hitCountdown'] = parseInt(hitCountdownSeconds[1]);
                }
            }
            // Current money and gold
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
        }
    });
    // Current state
    const stateDiv = $('#index_region > div:nth-child(2) > div[action^="map/state_details/"]');
    const stateId = stateDiv.attr('action').split('/').pop();
    let stateName = stateDiv.text().replace('State:', '').trim();
    stateName = stateName.replace(/\s+/g, ' ').trim();
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
    catch { }
    const index_regionDiv = $('#index_region');
    // Am I moving?
    try {
        if (index_regionDiv.text().includes('Moving in')) {
            const movingDiv = index_regionDiv.find('div.small.white > div');
            toBeReturned['moving'] = true;
            const movingToId = movingDiv
                .find('span')
                .attr('action')
                .split('/')
                .pop();
            toBeReturned['movingToId'] = movingToId;
            const remainingTimeMatch = movingDiv
                .text()
                .match(/until( |today|tomorrow)* (\d+:\d+)/);
            if (remainingTimeMatch) {
                const remainingTimeStr = remainingTimeMatch[2];
                let remainingTime = new Date();
                if (remainingTimeMatch[1]?.includes('today')) {
                    const [hours, minutes] = remainingTimeStr.split(':').map(Number);
                    remainingTime.setUTCHours(hours, minutes, 0, 0);
                }
                else if (remainingTimeMatch[1]?.includes('tomorrow')) {
                    remainingTime.setUTCDate(remainingTime.getUTCDate() + 1);
                    const [hours, minutes] = remainingTimeStr.split(':').map(Number);
                    remainingTime.setUTCHours(hours, minutes, 0, 0);
                }
                else {
                    const [hours, minutes] = remainingTimeStr.split(':').map(Number);
                    remainingTime.setUTCHours(hours, minutes, 0, 0);
                }
                toBeReturned['movingTime'] = Math.floor(remainingTime.getTime());
            }
        }
        else if (index_regionDiv.text().includes('Travelling back')) {
            const movingDiv = index_regionDiv.find('div.small.white > div');
            toBeReturned['movingBack'] = true;
            const remainingTimeMatch = movingDiv
                .text()
                .match(/( |Today|Tomorrow)* (\d+:\d+)/);
            if (remainingTimeMatch) {
                const remainingTimeStr = remainingTimeMatch[2];
                let remainingTime = new Date();
                if (remainingTimeMatch[1]?.includes('Today')) {
                    const [hours, minutes] = remainingTimeStr.split(':').map(Number);
                    remainingTime.setUTCHours(hours, minutes, 0, 0);
                }
                else if (remainingTimeMatch[1]?.includes('Tomorrow')) {
                    remainingTime.setUTCDate(remainingTime.getUTCDate() + 1);
                    const [hours, minutes] = remainingTimeStr.split(':').map(Number);
                    remainingTime.setUTCHours(hours, minutes, 0, 0);
                }
                else {
                    const [hours, minutes] = remainingTimeStr.split(':').map(Number);
                    remainingTime.setUTCHours(hours, minutes, 0, 0);
                }
                toBeReturned['movingBackTime'] = Math.floor(remainingTime.getTime());
            }
        }
        else {
            toBeReturned['moving'] = false;
            toBeReturned['movingBack'] = false;
        }
    }
    catch { }
    // Not residency
    if (index_regionDiv.text().includes('Request residency')) {
        toBeReturned['notResidency'] = true;
    }
    return toBeReturned;
}
