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
exports.getWarInfo = getWarInfo;
const cheerio = __importStar(require("cheerio"));
const utils_1 = require("../../misc/utils");
const timestamps_1 = require("../../misc/timestamps");
async function getWarInfo(user, id, force = false) {
    const war = await user.models.getWar(id);
    if (!force &&
        war.lastUpdate &&
        Date.now() - war.lastUpdate.getTime() < 1 * 60 * 1000) {
        return war;
    }
    const x = await fetch(`https://rivalregions.com/war/details/${id}`, {
        headers: {
            cookie: user.cookies,
        },
    });
    const content = await x.text();
    if (!content || content.length < 100) {
        return null;
    }
    const $ = cheerio.load(content);
    const typeElement = $('body > div.margin > h1 > div:nth-child(2)');
    let type = typeElement.text();
    if (type.includes('Troopers')) {
        type = 'troopers';
    }
    else if (type.includes('Sea')) {
        type = 'sea';
    }
    else if (type.includes('training')) {
        type = 'training';
    }
    else {
        const revolutionCoupElement = $('#war_w_ata > div > span.no_pointer');
        if (revolutionCoupElement.length) {
            if (type.includes('Revolution')) {
                type = 'revolution';
            }
            else if (type.includes('Coup')) {
                type = 'coup';
            }
            else {
                throw new Error(`Error getting war type: ${type}`);
            }
        }
        else {
            type = 'ground';
        }
    }
    war.type = type;
    const timeStr = $('body > div.margin > h1 > div.small').text();
    war.endingTime = (0, timestamps_1.getTimestamp)(timeStr);
    if (!['revolution', 'coup', 'training'].includes(type)) {
        const attackerId = $('#war_w_ata_s > div.imp > span:nth-child(3)')
            .attr('action')
            .split('/')
            .pop();
        const aggressor = await user.models.getRegion(parseInt(attackerId));
        war.aggressor = aggressor;
    }
    else {
        const aggressor = await user.models.getRegion(0);
        war.aggressor = aggressor;
    }
    if (type === 'training') {
        war.lastUpdate = new Date();
        war.name = 'training war';
        return war;
    }
    const defenderId = $('#war_w_def_s > span:nth-child(3)')
        .attr('action')
        .split('/')
        .pop();
    const defender = await user.models.getRegion(parseInt(defenderId));
    war.defender = defender;
    const attackerDamageSelector = type === 'revolution' || type === 'coup'
        ? '#war_w_ata > div.imp > span.hov2 > span'
        : '#war_w_ata_s > div.imp > span:nth-child(5) > span';
    war.aggressorDamage = (0, utils_1.dotless)($(attackerDamageSelector).text());
    war.defenderDamage = (0, utils_1.dotless)($('#war_w_def_s > span:nth-child(5) > span').text());
    war.lastUpdate = new Date();
    return war;
}
