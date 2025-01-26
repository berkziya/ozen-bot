"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resourceToId = exports.getMyOffer = exports.sellResource = exports.buyResource = void 0;
var tradeResource_1 = require("./tradeResource");
Object.defineProperty(exports, "buyResource", { enumerable: true, get: function () { return tradeResource_1.buyResource; } });
Object.defineProperty(exports, "sellResource", { enumerable: true, get: function () { return tradeResource_1.sellResource; } });
Object.defineProperty(exports, "getMyOffer", { enumerable: true, get: function () { return tradeResource_1.getMyOffer; } });
exports.resourceToId = {
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
