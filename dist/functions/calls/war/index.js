"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.troopAlphaDamage = void 0;
exports.cancel_autoattack = cancel_autoattack;
exports.attack = attack;
const calculateTroops_1 = require("./calculateTroops");
exports.troopAlphaDamage = {
    laserDrones: 6000,
    tanks: 10,
    aircrafts: 75,
    bombers: 800,
    battleships: 2000,
    moonTanks: 2000,
    spaceStations: 5000,
    // missiles: 900,
};
const troopIds = {
    aircrafts: 't1',
    tanks: 't2',
    missiles: 't14',
    bombers: 't16',
    battleships: 't18',
    moonTanks: 't22',
    spaceStations: 't23',
    laserDrones: 't27',
};
async function cancel_autoattack(user) {
    return await user.ajax('/war/autoset_cancel/');
}
async function attack(user, war, defend = true, max = false, drones = false) {
    try {
        const free_ene = max ? 0 : 1;
        const calculatedTroops = (0, calculateTroops_1.calculateTroops)(user.player, 300, war, drones);
        const aim = defend ? 1 : 0;
        const troops = Object.entries(calculatedTroops).reduce((acc, [key, value]) => ({ ...acc, [troopIds[key]]: value.toString() }), {});
        const n = JSON.stringify(troops);
        await cancel_autoattack(user);
        return await user.ajax('/war/autoset/', {
            free_ene,
            n,
            aim,
            edit: war.id,
        });
    }
    catch (e) {
        console.error('Error attacking', e);
    }
}
