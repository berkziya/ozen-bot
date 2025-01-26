"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDamage = calculateDamage;
const _1 = require(".");
const calculateTroops_1 = require("./calculateTroops");
function calculateDamage(player, war, defend = true) {
    const clamp = (min, num, max) => {
        return Math.max(min, Math.min(num, max));
    };
    const point25 = (num) => {
        return Math.floor(num * 4) / 4;
    };
    const macademy_buff = (region) => {
        return clamp(0, point25((region.buildings.militaryAcademy * 9) / 1600), 2.5);
    };
    let missile_diff = 0;
    let airport_diff = 0;
    let sea_diff = 0;
    if (war.aggressor.id) {
        missile_diff =
            (war.aggressor.buildings.missileSystem -
                war.defender.buildings.missileSystem) /
                400;
        airport_diff =
            (war.aggressor.buildings.airport - war.defender.buildings.airport) / 400;
        sea_diff =
            (war.aggressor.buildings.seaPort - war.defender.buildings.seaPort) / 400;
    }
    let diffs = 0;
    let buffs = 0;
    if (war.type === 'training') {
        diffs = 0.75;
        // buffs += war.defender.indexes['military'] / 20;
    }
    else if (!defend) {
        if (['ground', 'troopers'].includes(war.type))
            diffs += point25(clamp(-0.75, missile_diff, 0));
        if (['ground', 'troopers', 'moon'].includes(war.type))
            diffs += point25(clamp(0, airport_diff, 0.75));
        if (['sea'].includes(war.type))
            diffs += point25(clamp(-0.75, sea_diff, 0));
        if (war.aggressor.id)
            buffs += macademy_buff(war.aggressor);
        if (['revolution', 'coup'].includes(war.type)) {
            buffs += 0.05;
        }
        else {
            // buffs += war.aggressor.indexes['military'] / 20;
        }
    }
    else {
        if (['ground', 'troopers'].includes(war.type))
            diffs += point25(clamp(-0.75, -missile_diff, 0));
        if (['ground', 'troopers', 'moon'].includes(war.type))
            diffs += point25(clamp(0, -airport_diff, 0.75));
        if (['sea'].includes(war.type))
            diffs += point25(clamp(-0.75, -sea_diff, 0));
        buffs += macademy_buff(war.defender);
        // buffs += war.defender.indexes['military'] / 20;
    }
    buffs +=
        (600 + // if homeland bonus
            player.perks['str'] * 2 +
            player.perks['edu'] +
            player.perks['end'] +
            player.level) /
            200;
    const tanks_bonus = 0; // TODO
    const space_bonus = 0; // TODO
    const ships_bonus = 0; // TODO
    const drone_bonus = 0.35;
    const troops = (0, calculateTroops_1.calculateTroops)(player, 300, war);
    const alpha = Object.keys(troops).reduce((acc, troop) => acc + troops[troop] * _1.TROOP_ALPHA_DAMAGE[troop], 0);
    const tanks_ratio = ((troops['tanks'] || 0) * _1.TROOP_ALPHA_DAMAGE['tanks']) / alpha;
    const ships_ratio = ((troops['battleships'] || 0) * _1.TROOP_ALPHA_DAMAGE['battleships']) / alpha;
    const space_ratio = ((troops['spaceStations'] || 0) * _1.TROOP_ALPHA_DAMAGE['spaceStations']) /
        alpha;
    const drone_ratio = ((troops['laserDrones'] || 0) * _1.TROOP_ALPHA_DAMAGE['laserDrones']) / alpha;
    const troop_bonus = 1 +
        tanks_bonus * tanks_ratio +
        ships_bonus * ships_ratio +
        space_bonus * space_ratio +
        drone_bonus * drone_ratio;
    const user_bonus = 1; // + player.house["gym"]/100
    const damage = (1 + diffs + buffs) * alpha * troop_bonus * user_bonus;
    return Math.floor(damage);
}
