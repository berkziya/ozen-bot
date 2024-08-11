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
exports.getFactoryInfo = getFactoryInfo;
const cheerio = __importStar(require("cheerio"));
const utils_1 = require("../../misc/utils");
async function getFactoryInfo(user, factoryId, force) {
    const factory = await user.models.getFactory(factoryId);
    if (!force &&
        factory.lastUpdate &&
        Date.now() - factory.lastUpdate.getTime() < 20 * 60 * 1000) {
        return factory;
    }
    const x = await fetch(`https://rivalregions.com/factory/index/${factoryId}`, {
        headers: {
            cookie: user.cookies,
        },
    });
    const content = await x.text();
    if (!content || content.length < 100) {
        return null;
    }
    const $ = cheerio.load(content);
    try {
        factory.name = $('body > div.margin > h1')
            .contents()
            .filter(function () {
            return this.type === 'text';
        })
            .first()
            .text()
            .trim();
        factory.type = $('div.float_left > div.change_paper_about_target.float_left > span')
            .text()
            .split(' ')[0];
        factory.level = (0, utils_1.dotless)($('div.float_left > div.change_paper_about_target.float_left > span').text());
        factory.owner = await user.models.getPlayer($('span[action*="profile"]').attr('action').split('/').pop());
        factory.owner.setName($('span[action*="profile"]').text().trim());
        const region = await user.models.getRegion($('span[action*="map"]').attr('action').split('/').pop());
        factory.setRegion(region);
        factory.region.name = $('span[action*="map"]').text().trim();
        factory.setWage($('h2[class$="imp"]').first().text());
        const potentialWage = (0, utils_1.dotless)($('h2[class$="imp"]').last().text().split(' ')[0]);
        if (potentialWage) {
            factory.potentialWage = potentialWage;
        }
    }
    catch (e) {
        console.error(e);
    }
    return factory;
}
