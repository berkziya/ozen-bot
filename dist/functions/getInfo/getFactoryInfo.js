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
exports.getFactoryInfo = getFactoryInfo;
const cheerio = __importStar(require("cheerio"));
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const misc_1 = require("../../misc");
const UserService_1 = __importDefault(require("../../user/UserService"));
async function getFactoryInfo(factoryId, force) {
    const user = UserService_1.default.getInstance().getUser();
    (0, tiny_invariant_1.default)(user, 'Failed to get user');
    const factory = await user.models.getFactory(factoryId);
    if (!force &&
        factory.lastUpdate &&
        Date.now() - factory.lastUpdate.getTime() < 3 * 1000) {
        return factory;
    }
    const content = await user.get('/factory/index/' + factoryId);
    if (!content || content.length < 150)
        return null;
    const $ = cheerio.load(content);
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
    factory.level = (0, misc_1.dotless)($('div.float_left > div.change_paper_about_target.float_left > span').text());
    factory.owner = await user.models.getPlayer($('span[action*="profile"]').attr('action').split('/').pop());
    factory.owner.setName($('span[action*="profile"]').text().trim());
    const region = await user.models.getRegion($('span[action*="map"]').attr('action').split('/').pop());
    factory.setRegion(region);
    factory.region.name = $('span[action*="map"]').text().trim();
    factory.setWage($('h2.white.imp').first().text());
    const potentialWage = (0, misc_1.dotless)($('h2[class$="imp"]').last().text().split(' ')[0]);
    if (potentialWage) {
        factory.potentialWage = potentialWage;
    }
    return factory;
}
