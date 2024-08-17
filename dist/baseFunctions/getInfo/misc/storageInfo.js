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
exports.storageInfo = storageInfo;
const utils_1 = require("../../../misc/utils");
const cheerio = __importStar(require("cheerio"));
async function storageInfo(user) {
    const content = await fetch(user.link + '/storage', {
        headers: { cookie: user.cookies },
    }).then((x) => x.text());
    if (!content || content.length < 150)
        return null;
    const $ = cheerio.load(content);
    function extractStorageInfo(id) {
        return (0, utils_1.dotless)($(`span[urlbar="${id}"]`).text().trim());
    }
    user.player.storage.oil = extractStorageInfo(3);
    user.player.storage.ore = extractStorageInfo(4);
    user.player.storage.uranium = extractStorageInfo(11);
    user.player.storage.diamonds = extractStorageInfo(15);
    user.player.storage.liquidOxygen = extractStorageInfo(21);
    user.player.storage.helium3 = extractStorageInfo(24);
    user.player.storage.rivalium = extractStorageInfo(26);
    user.player.storage.antirad = extractStorageInfo(13);
    user.player.storage.energyDrink = extractStorageInfo(17);
    user.player.storage.spaceRockets = extractStorageInfo(20);
    user.player.storage.lss = extractStorageInfo(25);
    user.player.storage.tanks = extractStorageInfo(2);
    user.player.storage.aircrafts = extractStorageInfo(1);
    user.player.storage.missiles = extractStorageInfo(14);
    user.player.storage.bombers = extractStorageInfo(16);
    user.player.storage.battleships = extractStorageInfo(18);
    user.player.storage.laserDrones = extractStorageInfo(27);
    user.player.storage.moonTanks = extractStorageInfo(22);
    user.player.storage.spaceStations = extractStorageInfo(23);
    // user.player.storage.submarines = extractStorageInfo(19);
    $('script').each((_i, el) => {
        const script = $(el).html();
        if (!script)
            return;
        const money = script.match(/new_m\('([0-9.]+)'\);/);
        if (money)
            user.player.storage.money = (0, utils_1.dotless)(money[1]);
        const gold = script.match(/new_g\('([0-9.]+)'\);/);
        if (gold)
            user.player.storage.gold = (0, utils_1.dotless)(gold[1]);
        const expNlvl = script.match(/exp_size\((\d+), (\d+)/);
        if (expNlvl) {
            user.player.exp = parseInt(expNlvl[1]);
            user.player.level = parseInt(expNlvl[2]);
        }
    });
}
