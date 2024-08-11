"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.War = void 0;
class War {
    lastUpdate = new Date(0);
    id;
    name;
    type;
    endingTime;
    aggressor;
    defender;
    aggressorDamage = 0;
    defenderDamage = 0;
    aggresorPlayers = new Map();
    defenderPlayers = new Map();
    constructor(id_) {
        this.id = id_;
        this.name = 'war/' + this.id.toString();
    }
}
exports.War = War;
