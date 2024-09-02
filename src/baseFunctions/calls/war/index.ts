import { Player } from '../../../entity/Player';
import { War } from '../../../entity/War';
import { UserContext } from '../../../UserContext';
import { Region } from '../../../entity/Region';

const FULL_ENERGY = 300;

const TROOP_ADMG: { [key: string]: number } = {
  laserDrones: 6000,
  tanks: 10,
  aircrafts: 75,
  bombers: 800,
  battleships: 2000,
  moonTanks: 2000,
  spaceStations: 5000,
  // missiles: 900,
};

const TROOP_IDS: { [key: string]: string } = {
  aircrafts: 't1',
  tanks: 't2',
  missiles: 't14',
  bombers: 't16',
  battleships: 't18',
  moonTanks: 't22',
  spaceStations: 't23',
  laserDrones: 't27',
};

const TROOPS_FOR_TYPES: { [key: string]: string[] } = {
  training: ['laserDrones', 'tanks', 'aircrafts', 'bombers'],
  ground: ['laserDrones', 'tanks', 'aircrafts', 'bombers'],
  troopers: ['laserDrones', 'tanks', 'aircrafts', 'bombers'],
  revolution: ['laserDrones', 'tanks', 'aircrafts', 'bombers'],
  coup: ['laserDrones', 'aircrafts', 'bombers'],
  sea: ['battleships'],
  moon: ['moonTanks', 'spaceStations'],
  space: ['spaceStations'],
};

export async function cancel_autoattack(user: UserContext) {
  return await user.ajax('/war/autoset_cancel/');
}

export function calculate_troops(
  player: Player,
  energy: number = FULL_ENERGY,
  war: War,
  drones: boolean = false
): { [key: string]: number } {
  let alpha = player.alpha(energy);
  const n: { [key: string]: number } = {};

  for (const troop of TROOPS_FOR_TYPES[war.type]) {
    let count = Math.floor(alpha / TROOP_ADMG[troop]);
    if (troop === 'laserDrones' && !drones) {
      count = 0;
    }
    alpha -= count * TROOP_ADMG[troop];
    if (troop === 'aircrafts') {
      count *= 2;
    }
    n[troop] = count;
  }

  return n;
}

export async function attack(
  user: UserContext,
  war: War,
  agressor: boolean = false,
  max: boolean = false,
  drones: boolean = false
) {
  try {
    const free_ene = max ? 0 : 1;
    const calculatedTroops = calculate_troops(
      user.player,
      FULL_ENERGY,
      war,
      drones
    );
    const aim = agressor ? 0 : 1;

    const troops = Object.fromEntries(
      Object.entries(calculatedTroops).map(([key, value]) => [
        key,
        value.toString(),
      ])
    );

    let n = JSON.stringify(troops)
      .replace(/'/g, '"')
      .replace(/ /g, '')
      .replace(/:/g, ': ');

    for (const troop in TROOP_IDS) {
      n = n.replace(troop, TROOP_IDS[troop]);
    }

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

export function calculate_damage(
  player: Player,
  war: War,
  agressor: boolean = false
) {
  const clamp = (num: number, min: number, max: number): number => {
    return Math.max(min, Math.min(num, max));
  };

  const point25 = (num: number): number => {
    return Math.floor(num * 4) / 4;
  };

  const macademy_buff = (region: Region): number => {
    return clamp(
      0,
      point25((region.buildings.militaryAcademy * 9) / 1600),
      2.5
    );
  };

  let missile_diff = 0;
  let airport_diff = 0;
  let sea_diff = 0;

  if (war.aggressor instanceof Region) {
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

  if (!agressor) {
    if (war.type === 'training') {
      diffs = 0.75;
    } else if (['ground', 'troopers'].includes(war.type)) {
      diffs += point25(clamp(-0.75, missile_diff, 0));
      diffs += point25(clamp(0, airport_diff, 0.75));
    } else if (war.type === 'sea') {
      diffs += point25(clamp(-0.75, sea_diff, 0));
    }

    if (war.aggressor instanceof Region) buffs += macademy_buff(war.aggressor);
    if (['revolution', 'coup'].includes(war.type)) {
      buffs += 0.05;
    } else {
      // buffs += war.aggressor.indexes['military'] / 20;
    }
  } else {
    if (war.type === 'training') {
      diffs = 0.75;
    } else if (['ground', 'troopers'].includes(war.type)) {
      diffs += point25(clamp(-0.75, -missile_diff, 0));
      diffs += point25(clamp(0, -airport_diff, 0.75));
    } else if (war.type === 'sea') {
      diffs += point25(clamp(-0.75, -sea_diff, 0));
    }

    if (war.type !== 'training') {
      buffs += macademy_buff(war.defender);
    }
    // buffs += war.defender.indexes['military'] / 20;
  }

  buffs +=
    (600 + // homeland bonus
      player.perks['str'] * 2 +
      player.perks['edu'] +
      player.perks['end'] +
      player.level) /
    200;

  const tanks_bonus = 0; // TODO
  const space_bonus = 0; // TODO
  const ships_bonus = 0; // TODO
  const drone_bonus = 0.35;

  const troops = calculate_troops(player, FULL_ENERGY, war);
  const alpha = Object.keys(troops).reduce(
    (acc, troop) => acc + troops[troop] * TROOP_ADMG[troop],
    0
  );

  const tanks_ratio = (troops['tanks'] * TROOP_ADMG['tanks']) / alpha;
  const ships_ratio =
    (troops['battleships'] * TROOP_ADMG['battleships']) / alpha;
  const space_ratio =
    (troops['spaceStations'] * TROOP_ADMG['spaceStations']) / alpha;
  const drone_ratio =
    (troops['laserDrones'] * TROOP_ADMG['laserDrones']) / alpha;

  const troop_bonus =
    1 +
    tanks_bonus * tanks_ratio +
    ships_bonus * ships_ratio +
    space_bonus * space_ratio +
    drone_bonus * drone_ratio;

  const user_bonus = 1; // + player.house["gym"]/100

  const damage = (4 + diffs + buffs) * alpha * troop_bonus * user_bonus;
  return Math.floor(damage);
}
