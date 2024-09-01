"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Factory = exports.resourceToId = void 0;
const utils_1 = require("../misc/utils");
exports.resourceToId = {
    gold: 6,
    oil: 2,
    ore: 5,
    uranium: 11,
    diamonds: 15,
    liquidOxygen: 21,
    helium3: 24,
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
    get wage() {
        return this.isFixed ? this.wage_ : this.wage_ * Math.pow(this.level, 0.8);
    }
    get type() {
        return this.type_;
    }
    set type(theType) {
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
}
exports.Factory = Factory;
