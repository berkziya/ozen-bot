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
exports.getRegionInfo = getRegionInfo;
exports.getRegionInfoInner = getRegionInfoInner;
const cheerio = __importStar(require("cheerio"));
const utils_1 = require("../../misc/utils");
async function getRegionInfo(user, regionId, force) {
    const region = await user.models.getRegion(regionId);
    if (!force && region.lastUpdate && Date.now() - region.lastUpdate.getTime() < 60 * 15) {
        return region;
    }
    return getRegionInfoInner(user, regionId);
}
async function getRegionInfoInner(user, regionId, getAutonomy = false) {
    const url = '/map/details/' + regionId;
    const { content } = await user.get(url);
    if (!content || content.length < 100) {
        return null;
    }
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
    if (regionNameMatch && regionNameMatch[2]) {
        region.name = regionNameMatch[2];
        if (regionNameMatch[1] === 'autonomy') {
            autonomy = await user.models.getAutonomy(region.id);
            autonomy.name = region.name;
            autonomy.regions = new Set();
            autonomy.setCapital(region);
            autonomy.setState(state);
        }
    }
    // const buildingSpans = $(
    //   'body > div.minwidth > div.slide_profile_photo > div.imp.tc.small'
    // ).find('span');
    // for (let i = 0; i < buildingSpans.length; i++) {
    //   const buildingSpan = buildingSpans.eq(i);
    //   const buldingText = buildingSpan.text().split(': ');
    //   region.buildings.setBuilding(buldingText[0], buldingText[1]);
    // }
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
            const governor = await user.models.getPlayer(governorDiv.attr('action')?.split('/').pop());
            const governorName = governorDiv.text().match(/([^]*)Wage:/);
            governor.setName(governorName ? governorName[1] : governor.name);
            governor.setGovernor(autonomy);
            // autonomy.budget.setBudgetFromDiv(
            //   $('div.slide_profile_photo').find('div').last()
            // );
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
            // } else if (key === 'healthIndex') {
            //   const hospital = div.find('span').text().split('/')[0];
            //   region.indexes['hospital'] = parseInt(hospital);
            // } else if (key === 'militaryIndex') {
            //   const militaryBase = div.find('span').text().split('/')[0];
            //   region.indexes['militaryBase'] = parseInt(militaryBase);
            // } else if (key === 'educationIndex') {
            //   const school = div.find('span').text().split('/')[0];
            //   region.indexes['school'] = parseInt(school);
            // } else if (key === 'developmentIndex') {
            //   const houseFund = div.find('span').text().split('/')[0];
            //   region.indexes['houseFund'] = parseInt(houseFund);
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
            await Promise.all(borderRegions.map(async (el, i) => {
                const regionId = $(el).attr('action')?.split('/').pop();
                const borderRegion = await user.models.getRegion(regionId);
                borderRegion.name = $(el).text().trim();
                region.borderRegions.add(borderRegion);
            }));
        }
    }
    if (getAutonomy && autonomy) {
        return autonomy;
    }
    return region;
}
