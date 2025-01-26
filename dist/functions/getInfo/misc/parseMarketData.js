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
exports.parseMarketData = parseMarketData;
const cheerio = __importStar(require("cheerio"));
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const UserService_1 = __importDefault(require("../../../user/UserService"));
const resourceToId = {
    oil: 3,
    ore: 4,
    uranium: 11,
    diamonds: 15,
    liquidOxygen: 21,
    helium3: 24,
    rivalium: 26,
    antirad: 13,
    energyDrink: 17,
    spaceRockets: 20,
    lss: 25,
    tanks: 2,
    aircrafts: 1,
    missiles: 14,
    bombers: 16,
    battleships: 18,
    laserDrones: 27,
    moonTanks: 22,
    spaceStations: 23,
};
async function parseMarketData(resource) {
    const user = UserService_1.default.getInstance().getUser();
    (0, tiny_invariant_1.default)(user, 'Failed to get user');
    const content = await user.get('/storage/listed/' + resourceToId[resource]);
    if (!content || content.length < 150)
        return null;
    const $ = cheerio.load(content);
    const listings = $('tr[user]');
    const parsedOffers = [];
    for (let i = 0; i < listings.length; i++) {
        const offer = listings.eq(i);
        const offerById = parseInt(offer.attr('user'));
        // const offerByName = offer
        //   .find('span[action^="slide/profile/]')
        //   .first()
        //   .text();
        // const offerLocationId = offer
        //   .find('span[action^="map/details/]')
        //   .first()
        //   .attr('action')!
        //   .split('/')
        //   .pop();
        const offerAmount = parseInt(offer.find('td:nth-child(4)').attr('rat'));
        const offerPrice = parseInt(offer.find('td:nth-child(5)').attr('rat'));
        parsedOffers.push({
            userId: offerById,
            // userName: offerByName,
            // locationId: offerLocationId,
            amount: offerAmount,
            price: offerPrice,
        });
    }
    return parsedOffers;
}
