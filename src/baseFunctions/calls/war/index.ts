import { War } from '../../../entity/War';
import { UserContext } from '../../../UserContext';
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

export async function cancel_autoattack(user: UserContext) {
  return await user.ajax('/war/autoset_cancel/');
}

export async function attack(
  user: UserContext,
  war: War,
  defend: boolean = true,
  max: boolean = false,
  drones: boolean = false
) {
  try {
    const free_ene = max ? 0 : 1;
    const calculatedTroops = calculateTroops(user.player, 300, war, drones);
    const aim = defend ? 1 : 0;

    const troops = Object.entries(calculatedTroops).reduce(
      (acc, [key, value]) => ({ ...acc, [troopIds[key]]: value.toString() }),
      {}
    );

    let n = JSON.stringify(troops);

    await cancel_autoattack(user);

    return await user.ajax('/war/autoset/', {
      free_ene,
      n,
      aim,
      edit: war.id,
    });
  } catch (e) {
    console.error('Error attacking', e);
  }
}
