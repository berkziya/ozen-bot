"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.troopAlphaDamage = void 0;
exports.cancelAutoAttack = cancelAutoAttack;
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
async function cancelAutoAttack(user) {
    return await user.ajax('/war/autoset_cancel/');
}
async function attack(user, war, defend = true, max = false, drones = false) {
    const free_ene = max ? 0 : 1;
    const calculatedTroops = (0, calculateTroops_1.calculateTroops)(user.player, 300, war, drones);
    const aim = defend ? war.defender.id : war.aggressor.id;
    const troops = Object.entries(calculatedTroops).reduce((acc, [key, value]) => ({ ...acc, [troopIds[key]]: value.toString() }), {});
    const n = JSON.stringify(troops);
    await cancelAutoAttack(user);
    const result = await user.ajax('/war/autoset/', {
        free_ene,
        n,
        aim,
        edit: war.id,
    });
    return result;
}
