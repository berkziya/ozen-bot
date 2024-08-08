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
    // Get data from scripts
    $('script').each((i, el) => {
        const script = $(el).html();
        if (script) {
            // Get training war id
            const trainingWarId = script.match(/slide_header\('war\/details\/(d+)/);
            if (trainingWarId) {
                console.log(trainingWarId[1]);
            }
            // Current player id
            const playerId = script.match(/slide_header\('slide\/profile\/(d+)/);
            if (playerId) {
                console.log(playerId[1]);
            }
            // Next free hit
            const hitCountdown = script.match(/.war_index_war_countdown/);
            if (hitCountdown) {
                const hitCountdownSeconds = script.match(/until: (\d+)/);
                if (hitCountdownSeconds) {
                    console.log(hitCountdownSeconds[1]);
                }
            }
            // Current money and gold
            const money = script.match(/new_m\('([0-9.]+)'\);/);
            if (money) {
                console.log(money[1]);
                user.player.storage.money = (0, utils_1.dotless)(money[1]);
            }
            const gold = script.match(/new_g\('([0-9.]+)'\);/);
            if (gold) {
                console.log(gold[1]);
                user.player.storage.gold = (0, utils_1.dotless)(gold[1]);
            }
        }
    });
    // Current state
    const stateDiv = $('#index_region > div:nth-child(2) > div[action^="map/state_details/"]');
    const stateId = stateDiv.attr('action').split('/').pop();
    const stateName = stateDiv.text().replace('State: ', '').trim();
    const state = await user.models.getState(stateId);
    state.name = stateName;
    // Current region
    const regionDiv = $('#index_region > div:nth-child(3) > div > span[action^="map/details/"]');
    const regionId = regionDiv.attr('action').split('/').pop();
    const regionName = regionDiv.text().trim();
    const region = await user.models.getRegion(regionId);
    region.name = regionName;
    user.player.setRegion(region);
    region.setState(state);
    // Current auto war
    const autoWarSpan = $('div.war_index_war > div:nth-child(1) > span').last();
    // if (autoWarSpan.text() == 'auto') {
    const autoWarId = autoWarSpan.attr('action').split('/').pop();
    console.log(autoWarId);
    // }
    console.log(state.toJSON());
    console.log(region.toJSON());
}
