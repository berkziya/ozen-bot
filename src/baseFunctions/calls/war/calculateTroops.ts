import { TROOP_ADMG } from '.';
import { Player } from '../../../entity/Player';
import { War } from '../../../entity/War';

const TROOPS_FOR_WAR_TYPES: { [key: string]: string[] } = {
  training: ['laserDrones', 'tanks', 'aircrafts', 'bombers'],
  ground: ['laserDrones', 'tanks', 'aircrafts', 'bombers'],
  troopers: ['laserDrones', 'tanks', 'aircrafts', 'bombers'],
  revolution: ['laserDrones', 'tanks', 'aircrafts', 'bombers'],
  coup: ['laserDrones', 'aircrafts', 'bombers'],
  sea: ['battleships'],
  moon: ['spaceStations', 'moonTanks'],
  space: ['spaceStations'],
};

export function calculateTroops(
  player: Player,
  energy: number = 300,
  war: War,
  drones: boolean = false
): { [key: string]: number } {
  let alpha = player.alpha(energy);
  const n: { [key: string]: number } = {};

  for (const troop of TROOPS_FOR_WAR_TYPES[war.type]) {
    let count = Math.floor(alpha / TROOP_ADMG[troop]);
    if (!drones && ['laserDrones', 'spaceStations'].includes(troop)) count = 0;
    alpha -= count * TROOP_ADMG[troop];
    n[troop] = count;
  }

  return n;
}
