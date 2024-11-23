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
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageInfo = storageInfo;
const cheerio = __importStar(require("cheerio"));
const utils_1 = require("../../../misc/utils");
async function storageInfo(user) {
    const content = await user.get('/storage');
    if (!content || content.length < 150)
        return null;
    const $ = cheerio.load(content);
    function collectInfo(id) {
        return (0, utils_1.dotless)($(`span[urlbar="${id}"]`).text().trim());
    }
    user.player.storage.oil = collectInfo(3);
    user.player.storage.ore = collectInfo(4);
    user.player.storage.uranium = collectInfo(11);
    user.player.storage.diamonds = collectInfo(15);
    user.player.storage.liquidOxygen = collectInfo(21);
    user.player.storage.helium3 = collectInfo(24);
    user.player.storage.rivalium = collectInfo(26);
    user.player.storage.antirad = collectInfo(13);
    user.player.storage.energyDrink = collectInfo(17);
    user.player.storage.spaceRockets = collectInfo(20);
    user.player.storage.lss = collectInfo(25);
    user.player.storage.tanks = collectInfo(2);
    user.player.storage.aircrafts = collectInfo(1);
    user.player.storage.missiles = collectInfo(14);
    user.player.storage.bombers = collectInfo(16);
    user.player.storage.battleships = collectInfo(18);
    user.player.storage.laserDrones = collectInfo(27);
    user.player.storage.moonTanks = collectInfo(22);
    user.player.storage.spaceStations = collectInfo(23);
    // user.player.storage.submarines = collectInfo(19);
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
    return user.player.storage;
}
