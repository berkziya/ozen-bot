"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Autonomy = void 0;
const Storage_1 = require("./shared/Storage");
class Autonomy {
    lastUpdate = 0;
    id;
    name;
    state;
    capital;
    regions;
    governor;
    storage = new Storage_1.Storage();
    constructor(id_) {
        this.id = id_;
        this.name = 'autonomy/' + this.id.toString();
        this.regions = [];
        this.governor = null;
    }
    toJSON() {
        return {
            lastUpdate: this.lastUpdate,
            id: this.id,
            name: this.name,
            state: this.state,
            capital: this.capital,
            regions: this.regions,
            governor: this.governor,
        };
    }
}
exports.Autonomy = Autonomy;
