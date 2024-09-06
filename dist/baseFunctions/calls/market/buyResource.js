"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyResource = buyResource;
const parseMarketData_1 = require("../../getInfo/misc/parseMarketData");
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
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
async function buyResource(user, resource, amount) {
    const offers = await (0, parseMarketData_1.parseMarketData)(user, resource);
    (0, tiny_invariant_1.default)(offers);
    const offer = offers[1];
    console.log('buying ' +
        resource +
        ' from ' +
        offer.userId +
        ' at the price of ' +
        offer.price);
    user.ajax(`/storage/buy/${resourceToId[resource]}/${offer.userId}/${amount}/${offer.price}`);
}
