"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = void 0;
class State {
    lastUpdate = 0;
    id;
    name;
    regions;
    autonomies;
    governmentForm = 'Dictatorship';
    leader = null;
    leaderIsCommander = false;
    econMinister = null;
    foreignMinister = null;
    leaderTermStart = null;
    constructor(id_) {
        this.id = id_;
        this.name = 'state/' + this.id.toString();
        this.regions = [];
        this.autonomies = [];
    }
    toJSON() {
        return {
            lastUpdate: this.lastUpdate,
            id: this.id,
            name: this.name,
            regions: this.regions.map((region) => region.id),
            autonomies: this.autonomies.map((autonomy) => autonomy.id),
            governmentForm: this.governmentForm,
            leader: this.leader?.id,
            leaderIsCommander: this.leaderIsCommander,
            econMinister: this.econMinister?.id,
            foreignMinister: this.foreignMinister?.id,
            leaderTermStart: this.leaderTermStart,
        };
    }
}
exports.State = State;
