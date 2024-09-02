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
exports.getFactoryList = getFactoryList;
const Factory_1 = require("../../../entity/Factory");
const Region_1 = require("../../../entity/Region");
const cheerio = __importStar(require("cheerio"));
async function getFactoryList(user, locationId, isState = false, resource = 'gold') {
    const resourceId = Factory_1.resourceToId[resource];
    const link = isState
        ? `/factory/state/${locationId}/0/${resourceId}/`
        : `/factory/search/${locationId}/0/${resourceId}/`;
    const content = await user.get(link);
    if (!content || content.length < 150)
        return null;
    const $ = cheerio.load(content);
    const location = isState
        ? await user.models.getState(locationId)
        : await user.models.getRegion(locationId);
    const factories = new Set();
    const factoryElements = $('tr[user]');
    for (let i = 0; i < factoryElements.length; i++) {
        const factoryElement = factoryElements.eq(i);
        const factoryId = parseInt(factoryElement.attr('user'));
        const factory = await user.models.getFactory(factoryId);
        const factoryTds = factoryElement.find('td[rat]');
        factory.level = parseInt(factoryTds.eq(0).attr('rat'));
        factory.type = resource;
        if (location instanceof Region_1.Region)
            factory.setRegion(location);
        factory.setWage(factoryTds.eq(2).text());
        const ownerId = parseInt(factoryTds.eq(3).attr('rat'));
        factory.owner = await user.models.getPlayer(ownerId);
        factories.add(factory);
    }
    return [...factories];
}
