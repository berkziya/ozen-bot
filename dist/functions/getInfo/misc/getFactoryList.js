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
exports.getFactoryList = getFactoryList;
exports.getBestFactory = getBestFactory;
const cheerio = __importStar(require("cheerio"));
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const Factory_1 = require("../../../entity/Factory");
const Region_1 = require("../../../entity/Region");
const State_1 = require("../../../entity/State");
const UserHandler_1 = require("../../../user/UserHandler");
const getFactoryInfo_1 = require("../getFactoryInfo");
async function getFactoryList(location, resource = 'gold') {
    const user = UserHandler_1.UserHandler.getInstance().getUser();
    (0, tiny_invariant_1.default)(user, 'Failed to get user');
    const resourceId = Factory_1.factoryIds[resource];
    const link = location instanceof State_1.State
        ? `/factory/state/${location.id}/0/${resourceId}/`
        : `/factory/search/${location.id}/0/${resourceId}/`;
    const content = await user.get(link);
    if (!content || content.length < 150)
        return null;
    const $ = cheerio.load(content);
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
        if (factoryTds.eq(2).attr('class').includes('ore'))
            factory.setWage('0');
        const ownerId = parseInt(factoryTds.eq(3).attr('rat'));
        factory.owner = await user.models.getPlayer(ownerId);
        factories.add(factory);
    }
    return [...factories];
}
async function getBestFactory(location, resource = 'gold', fixedOK = true) {
    let factories = await getFactoryList(location, resource);
    if (!factories)
        return null;
    if (resource === 'gold') {
        const nonFixedFactories = factories.filter((factory) => !factory.isFixed);
        const bestNonFixed = nonFixedFactories.sort((a, b) => b.wage() - a.wage())[0];
        await (0, getFactoryInfo_1.getFactoryInfo)(bestNonFixed.id);
        const coef = bestNonFixed.potentialWage / bestNonFixed.production();
        factories.forEach((factory) => (factory.potentialWage = factory.production() * coef));
        factories = factories.sort((a, b) => {
            if (a.isFixed && !b.isFixed)
                return b.wage() - a.potentialWage;
            if (!a.isFixed && b.isFixed)
                return b.potentialWage - a.wage();
            return b.potentialWage - a.potentialWage;
        });
        for (const factory of factories) {
            if (factory.isFixed) {
                if (fixedOK && factory.wage() >= bestNonFixed.potentialWage) {
                    return factory;
                }
            }
            else {
                return factory;
            }
        }
    }
    return factories
        .filter((factory) => !factory.isFixed)
        .sort((a, b) => b.wage() - a.wage())[0];
}
