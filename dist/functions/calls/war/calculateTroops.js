"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TROOPS_FOR_WAR_TYPES = void 0;
exports.calculateTroops = calculateTroops;
const _1 = require(".");
exports.TROOPS_FOR_WAR_TYPES = {
    training: ['laserDrones', 'tanks', 'aircrafts', 'bombers'],
    ground: ['laserDrones', 'tanks', 'aircrafts', 'bombers'],
    troopers: ['laserDrones', 'tanks', 'aircrafts', 'bombers'],
    revolution: ['laserDrones', 'tanks', 'aircrafts', 'bombers'],
    coup: ['laserDrones', 'aircrafts', 'bombers'],
    sea: ['battleships'],
    moon: ['spaceStations', 'moonTanks'],
    space: ['spaceStations'],
};
function calculateTroops(player, energy = 300, war, drones = false) {
    let alpha = player.alpha(energy);
    const n = {};
    for (const troop of exports.TROOPS_FOR_WAR_TYPES[war.type]) {
        let count = Math.floor(alpha / _1.TROOP_ALPHA_DAMAGE[troop]);
        if (!drones && troop == 'laserDrones')
            count = 0;
        if (!drones && war.type == 'moon' && troop == 'spaceStations')
            count = 0;
        alpha -= count * _1.TROOP_ALPHA_DAMAGE[troop];
        n[troop] = count;
    }
    return n;
}
