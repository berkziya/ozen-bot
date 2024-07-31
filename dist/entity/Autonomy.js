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
        this.regions = new Set();
        this.governor = null;
    }
    setState(state) {
        if (this.state) {
            this.state.autonomies.delete(this);
        }
        this.state = state;
        state.autonomies.add(this);
    }
    setCapital(region) {
        this.capital = region;
        this.addRegion(region);
    }
    setGovernor(player) {
        this.governor = player;
    }
    addRegion(region) {
        this.regions.add(region);
    }
    removeRegion(region) {
        this.regions.delete(region);
    }
    toJSON() {
        return {
            lastUpdate: this.lastUpdate,
            id: this.id,
            name: this.name,
            state: this.state,
            capital: this.capital,
            regions: Array.from(this.regions, (region) => region.id),
            governor: this.governor,
        };
    }
}
exports.Autonomy = Autonomy;
