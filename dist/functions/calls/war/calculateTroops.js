import { TROOP_ALPHA_DAMAGE } from '.';
export const TROOPS_FOR_WAR_TYPES = {
    training: ['laserDrones', 'tanks', 'aircrafts', 'bombers'],
    ground: ['laserDrones', 'tanks', 'aircrafts', 'bombers'],
    troopers: ['laserDrones', 'tanks', 'aircrafts', 'bombers'],
    revolution: ['laserDrones', 'tanks', 'aircrafts', 'bombers'],
    coup: ['laserDrones', 'aircrafts', 'bombers'],
    sea: ['battleships'],
    moon: ['spaceStations', 'moonTanks'],
    space: ['spaceStations'],
};
export function calculateTroops(player, energy = 300, war, drones = false) {
    let alpha = player.alpha(energy);
    const n = {};
    for (const troop of TROOPS_FOR_WAR_TYPES[war.type]) {
        let count = Math.floor(alpha / TROOP_ALPHA_DAMAGE[troop]);
        if (!drones && troop == 'laserDrones')
            count = 0;
        if (!drones && war.type == 'moon' && troop == 'spaceStations')
            count = 0;
        alpha -= count * TROOP_ALPHA_DAMAGE[troop];
        n[troop] = count;
    }
    return n;
}
