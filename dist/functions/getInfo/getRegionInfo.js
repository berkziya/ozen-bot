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
exports.getRegionInfo = getRegionInfo;
exports.getRegionInfoInner = getRegionInfoInner;
const cheerio = __importStar(require("cheerio"));
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const utils_1 = require("../../misc/utils");
const UserHandler_1 = require("../../UserHandler");
async function getRegionInfo(regionId, force) {
    const user = UserHandler_1.UserHandler.getInstance().getUser();
    (0, tiny_invariant_1.default)(user, 'Failed to get user');
    const region = await user.models.getRegion(regionId);
    if (!force &&
        region.lastUpdate &&
        Date.now() - region.lastUpdate.getTime() < 3 * 1000) {
        return region;
    }
    return getRegionInfoInner(user, regionId);
}
async function getRegionInfoInner(user, regionId, getAutonomy = false) {
    const content = await user.get('/map/details/' + regionId);
    if (!content || content.length < 150)
        return null;
    const region = await user.models.getRegion(regionId);
    region.state = null;
    region.autonomy = null;
    region.profitShare = 0;
    region.needResidencyToWork = false;
    let state = null;
    let autonomy = null;
    const $ = cheerio.load(content);
    const headerData = $('body > div.margin > h1');
    const stateSpan = headerData.find('span[action*="map/state"]').first();
    const stateId = stateSpan.attr('action')?.split('/').pop();
    state = await user.models.getState(stateId);
    state.name = stateSpan.text();
    region.setState(state);
    const autonomySpan = headerData.find('span[action*="map/autonomy"]').first();
    if (autonomySpan.length) {
        const autonomyId = autonomySpan.attr('action')?.split('/').pop();
        autonomy = await user.models.getAutonomy(autonomyId);
        autonomy.name = autonomySpan.text();
        region.setAutonomy(autonomy);
        autonomy.setState(state);
    }
    const regionNameMatch = headerData
        .contents()
        .filter(function () {
        return this.type === 'text';
    })
        .first()
        .text()
        .match(/: (region|autonomy) (.*?) and /);
    if (regionNameMatch?.[2]) {
        region.name = regionNameMatch[2];
        if (regionNameMatch[1] === 'autonomy') {
            autonomy = await user.models.getAutonomy(region.id);
            autonomy.name = region.name;
            autonomy.regions = new Set();
            autonomy.setCapital(region);
            autonomy.setState(state);
        }
    }
    const buildingSpans = $('body > div.minwidth > div.slide_profile_photo > div.imp.tc.small').find('span');
    for (let i = 0; i < buildingSpans.length; i++) {
        const buildingSpan = buildingSpans.eq(i);
        const buldingText = buildingSpan.text().split(': ');
        region.buildings[buldingText[0]] = (0, utils_1.dotless)(buldingText[1]);
    }
    const divs = $('#region_scroll > div');
    for (let i = 0; i < divs.length; i++) {
        const div = divs.eq(i);
        const key = (0, utils_1.toCamelCase)(div.find('h2').first().text());
        if (key === 'governor') {
            autonomy = await user.models.getAutonomy(region.id);
            autonomy.name = region.name;
            autonomy.regions = new Set();
            autonomy.setCapital(region);
            autonomy.setState(state);
            const governorDiv = div.find('div[action*="profile"]');
            const governor = await user.models.getPlayer(governorDiv.attr('action').split('/').pop());
            const governorName = governorDiv.text().match(/([^]*)Wage:/);
            governor.setName(governorName ? governorName[1] : governor.name);
            governor.setGovernor(autonomy);
            const budgetDiv = $('div.slide_profile_photo').find('div').last();
            autonomy.storage.setBudgetFromDiv(budgetDiv);
        }
        if (key === 'profitShare') {
            const profitShare = div
                .find('div.slide_profile_data > h2 > span')
                .text()
                .replace('%', '');
            region.profitShare = parseFloat(profitShare) / 100;
        }
        else if (key === 'taxRate') {
            const taxRate = div
                .find('div.short_details.tc.imp.float_left.no_pointer.spd')
                .text()
                .replace('%', '');
            region.taxRate = parseFloat(taxRate) / 100;
        }
        else if (key === 'marketTaxes') {
            const marketTaxes = div
                .find('div.short_details.tc.imp.float_left.no_pointer.spd')
                .text()
                .replace('%', '');
            region.marketTaxes = parseFloat(marketTaxes) / 100;
        }
        else if (key === 'factoriesOutputTaxes') {
            const whats = [
                'gold',
                'oil',
                'ore',
                'uranium',
                'diamonds',
            ];
            for (let i = 0; i < whats.length; i++) {
                const what = whats[i];
                const factoryOutputTaxes = div
                    .find('span[what="' + what + '"]')
                    .text()
                    .replace('%', '');
                region.factoryOutputTaxes[what] = parseFloat(factoryOutputTaxes) / 100;
            }
        }
        else if (key === 'seaAccess') {
            if (div.text().includes('Yes')) {
                region.seaAccess = true;
            }
        }
        else if (key === 'residencyForWork') {
            if (div.text().includes('Not')) {
                region.needResidencyToWork = false;
            }
            else {
                region.needResidencyToWork = true;
            }
        }
        else if (key === 'borderRegions') {
            if (region.borderRegions.size > 0) {
                break;
            }
            const borderRegions = div.find('div[action^="map/details/"]').toArray();
            await Promise.all(borderRegions.map(async (el) => {
                const regionId = $(el).attr('action').split('/').pop();
                const borderRegion = await user.models.getRegion(regionId);
                borderRegion.name = $(el).text().trim();
                region.borderRegions.add(borderRegion);
            }));
        }
    }
    if (getAutonomy && autonomy) {
        autonomy.lastUpdate = new Date();
        return autonomy;
    }
    region.lastUpdate = new Date();
    return region;
}
