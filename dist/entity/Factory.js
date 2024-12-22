"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Factory = exports.resBalancers = exports.resCoef = exports.factoryIds = void 0;
const utils_1 = require("../misc/utils");
exports.factoryIds = {
    gold: 6,
    oil: 2,
    ore: 5,
    uranium: 11,
    diamonds: 15,
    liquidOxygen: 21,
    helium3: 24,
};
exports.resCoef = {
    gold: 0.4,
    oil: 0.65,
    ore: 0.65,
    uranium: 0.75,
    diamonds: 0.75,
    liquidOxygen: 1,
    helium3: 1,
};
exports.resBalancers = {
    gold: 4,
    oil: 1,
    ore: 1,
    uranium: 1,
    diamonds: 1 / 1000,
    liquidOxygen: 1 / 5,
    helium3: 1 / 1000,
};
class Factory {
    lastUpdate = new Date(0);
    id;
    name;
    level = 1;
    owner;
    region;
    wage_ = 0;
    isFixed = false;
    potentialWage = 0;
    type_;
    constructor(id_) {
        this.id = id_;
        this.name = 'factory/' + this.id.toString();
    }
    setOwner(player) {
        this.owner = player;
        player.addFactory(this);
    }
    setRegion(region) {
        this.region = region;
        region.factories.add(this);
    }
    setWage(wage) {
        if (wage.includes('%') || (this.type !== 'gold' && !wage.includes('$'))) {
            wage = wage.split(' ')[0];
            this.wage_ = (0, utils_1.dotless)(wage) / 100;
            this.isFixed = false;
        }
        else {
            this.wage_ = (0, utils_1.dotless)(wage);
            this.isFixed = true;
        }
    }
    production(playerLevel = 1, deep = 1, workExp = 1) {
        return (0.2 *
            Math.pow(playerLevel, 0.8) *
            Math.pow((exports.resCoef[this.type_] * deep) / 10, 0.8) *
            Math.pow(this.level, 0.8) *
            Math.pow(workExp / 10, 0.6) *
            exports.resBalancers[this.type_]);
    }
    wage(playerLevel, deepResource, workExp) {
        return this.isFixed
            ? this.wage_
            : this.wage_ * this.production(playerLevel, deepResource, workExp) * 1.2;
    }
    get type() {
        return this.type_;
    }
    set type(theType) {
        theType = (0, utils_1.toCamelCase)(theType);
        if (theType === 'diamond') {
            this.type_ = 'diamonds';
        }
        else if (theType === 'liquifaction') {
            this.type_ = 'liquidOxygen';
        }
        else {
            this.type_ = theType;
        }
    }
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            level: this.level,
            owner: this.owner?.id,
            region: this.region?.id,
            wage: this.wage,
            isFixed: this.isFixed,
            potentialWage: this.potentialWage,
            type: this.type,
        };
    }
    static [Symbol.hasInstance](instance) {
        return instance && typeof instance === 'object' && 'isFixed' in instance;
    }
}
exports.Factory = Factory;
