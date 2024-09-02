"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = exports.idToResource = void 0;
const utils_1 = require("../../misc/utils");
exports.idToResource = {
    3: 'oil',
    4: 'ore',
    11: 'uranium',
    15: 'diamonds',
    21: 'liquidOxygen',
    24: 'helium3',
    26: 'rivalium',
    13: 'antirad',
    17: 'energyDrink',
    20: 'spaceRockets',
    25: 'lss',
    2: 'tanks',
    1: 'aircrafts',
    14: 'missiles',
    16: 'bombers',
    18: 'battleships',
    27: 'laserDrones',
    22: 'moonTanks',
    23: 'spaceStations',
};
class Storage {
    constructor() {
        this.subStorages = [];
    }
    owner = null;
    subStorages;
    stateMoney = 0;
    stateGold = 0;
    stateOil = 0;
    stateOre = 0;
    stateUranium = 0;
    stateDiamonds = 0;
    money = 0;
    gold = 0;
    oil = 0;
    ore = 0;
    uranium = 0;
    diamonds = 0;
    liquidOxygen = 0;
    helium3 = 0;
    rivalium = 0;
    antirad = 0;
    energyDrink = 0;
    spaceRockets = 0;
    lss = 0;
    tanks = 0;
    aircrafts = 0;
    missiles = 0;
    bombers = 0;
    battleships = 0;
    laserDrones = 0;
    moonTanks = 0;
    spaceStations = 0;
    setOwner(owner) {
        this.owner = owner;
    }
    async setBudgetFromDiv(div) {
        const spans = div.find('span');
        this.stateMoney = (0, utils_1.dotless)(spans.eq(0).text());
        this.stateGold = (0, utils_1.dotless)(spans.eq(1).text());
        this.stateOil = (0, utils_1.dotless)(spans.eq(2).text());
        this.stateOre = (0, utils_1.dotless)(spans.eq(3).text());
        this.stateUranium = (0, utils_1.dotless)(spans.eq(4).text());
        this.stateDiamonds = (0, utils_1.dotless)(spans.eq(5).text());
    }
    toJSON() {
        return {
            subStorages: this.subStorages,
            stateMoney: this.stateMoney,
            stateGold: this.stateGold,
            stateOil: this.stateOil,
            stateOre: this.stateOre,
            stateUranium: this.stateUranium,
            stateDiamonds: this.stateDiamonds,
            money: this.money,
            gold: this.gold,
            oil: this.oil,
            ore: this.ore,
            uranium: this.uranium,
            diamonds: this.diamonds,
            liquidOxygen: this.liquidOxygen,
            helium3: this.helium3,
            rivalium: this.rivalium,
            antirad: this.antirad,
            energyDrink: this.energyDrink,
            spaceRockets: this.spaceRockets,
            lss: this.lss,
            tanks: this.tanks,
            aircrafts: this.aircrafts,
            missiles: this.missiles,
            bombers: this.bombers,
            battleships: this.battleships,
            laserDrones: this.laserDrones,
            moonTanks: this.moonTanks,
            spaceStations: this.spaceStations,
        };
    }
}
exports.Storage = Storage;
