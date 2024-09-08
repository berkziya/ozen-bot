import { War } from '../../../entity/War';
import { User } from '../../../User';
import { calculateTroops } from './calculateTroops';

export const troopAlphaDamage: { [key: string]: number } = {
  laserDrones: 6000,
  tanks: 10,
  aircrafts: 75,
  bombers: 800,
  battleships: 2000,
  moonTanks: 2000,
  spaceStations: 5000,
  // missiles: 900,
};

const troopIds: { [key: string]: string } = {
  aircrafts: 't1',
  tanks: 't2',
  missiles: 't14',
  bombers: 't16',
  battleships: 't18',
  moonTanks: 't22',
  spaceStations: 't23',
  laserDrones: 't27',
};

export async function cancelAutoAttack(user: User) {
  return await user.ajax('/war/autoset_cancel/');
}

export async function attack(
  user: User,
  war: War,
  defend: boolean = true,
  max: boolean = false,
  drones: boolean = false
) {
  const free_ene = max ? 0 : 1;
  const calculatedTroops = calculateTroops(user.player, 300, war, drones);
  const aim = defend ? war.defender.id : war.aggressor.id;

  const troops = Object.entries(calculatedTroops).reduce(
    (acc, [key, value]) => ({ ...acc, [troopIds[key]]: value.toString() }),
    {}
  );

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
