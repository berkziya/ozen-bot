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
exports.getAutonomyInfo = getAutonomyInfo;
const cheerio = __importStar(require("cheerio"));
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const utils_1 = require("../../misc/utils");
const UserHandler_1 = require("../../UserHandler");
const getRegionInfo_1 = require("./getRegionInfo");
async function getAutonomyInfo(autonomyId, force) {
    const user = UserHandler_1.UserHandler.getInstance().getUser();
    (0, tiny_invariant_1.default)(user, 'Failed to get user');
    const autonomy = await user.models.getAutonomy(autonomyId);
    if (!force &&
        autonomy.lastUpdate &&
        Date.now() - autonomy.lastUpdate.getTime() < 3 * 1000) {
        return autonomy;
    }
    const content = await user.get('/map/autonomy_details/' + autonomyId);
    if (!content || content.length < 150) {
        return (0, getRegionInfo_1.getRegionInfoInner)(user, autonomyId, true);
    }
    autonomy.governor = null;
    autonomy.regions = new Set();
    const $ = cheerio.load(content);
    const stateSpan = $('h1 > span[action]');
    const stateId = stateSpan.attr('action').split('/').pop();
    const state = await user.models.getState(stateId);
    state.name = stateSpan.text().trim();
    autonomy.setState(state);
    autonomy.name = $('h1')
        .contents()
        .filter((_i, e) => e.type === 'text')
        .first()
        .text()
        .replace(', ', '')
        .trim();
    const budgetDiv = $('div.slide_profile_photo > div.imp');
    autonomy.storage.setBudgetFromDiv(budgetDiv);
    const divs = $('#region_scroll > div');
    for (let i = 0; i < divs.length; i++) {
        const div = divs.eq(i);
        const key = (0, utils_1.toCamelCase)(div.find('h2').first().text());
        if (key === 'governor') {
            const governorDiv = div.find('div.slide_profile_data > div');
            const governor = await user.models.getPlayer(governorDiv.attr('action').split('/').pop());
            const governorName = governorDiv.text().match(/([^]*)Wage:/);
            governor.setName(governorName ? governorName[1] : governor.name);
            autonomy.setGovernor(governor);
        }
        if (key === 'autonomyRegions') {
            const regions = div.find('div[action^="map/details/"]').toArray();
            await Promise.all(regions.map(async (el, i) => {
                const region = await user.models.getRegion($(el).attr('action').split('/').pop());
                region.name = $(el).text().trim();
                autonomy.addRegion(region);
                if (i === 0) {
                    autonomy.setCapital(region);
                }
            }));
        }
    }
    autonomy.lastUpdate = new Date();
    return autonomy;
}
