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
exports.flightPrices = flightPrices;
const cheerio = __importStar(require("cheerio"));
const UserHandler_1 = require("../../../user/UserHandler");
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const utils_1 = require("../../../misc/utils");
function parseTime(x) {
    return (parseInt(x[1] ?? '0') * 3600 + parseInt(x[2] ?? '0') * 60 + parseInt(x[3]));
}
async function flightPrices(location) {
    const user = UserHandler_1.UserHandler.getInstance().getUser();
    (0, tiny_invariant_1.default)(user, 'Failed to get user');
    const content = await user.get(`/map/region_data/${location.id}`);
    if (!content || content.length < 150)
        return null;
    const $ = cheerio.load(content);
    const prices = {
        1: { price: 0, time: 0, bordersOpen: true },
        2: { price: 0, time: 0, bordersOpen: true },
    };
    // Get data from scripts
    $('script').each((_i, el) => {
        const script = $(el).html();
        if (script) {
            const flightTimes = [
                ...script.matchAll(/\$\('\.type_distance'\)\.html\('([0-2][0-9])?:?([0-5][0-9])?:?([0-5][0-9])'\);/g),
            ];
            (0, tiny_invariant_1.default)(flightTimes, 'Failed to get flight times');
            if (flightTimes[0])
                prices[1].time = parseTime(flightTimes[0]);
            if (location.id > 200000 && location.id < 200073) {
                prices[1].price = 5e9;
            }
            else {
                const flightPrices = script.match(/\$\('#move_here'\)\.html\('([0-9.]+) \$'\);/g);
                (0, tiny_invariant_1.default)(flightPrices, 'Failed to get flight prices');
                if (flightPrices[0])
                    prices[1].price = (0, utils_1.dotless)(flightPrices[0]);
                if (flightTimes[1])
                    prices[2].time = parseTime(flightTimes[1]);
                if (flightPrices[1])
                    prices[2].price = (0, utils_1.dotless)(flightPrices[1]);
            }
        }
    });
    if ($.html().includes('button_red')) {
        prices[1].bordersOpen = false;
        prices[2].bordersOpen = false;
    }
    return prices[1].price ? prices : null;
}
