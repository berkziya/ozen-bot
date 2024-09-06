import { troopAlphaDamage } from '.';
import { Player } from '../../../entity/Player';
import { Region } from '../../../entity/Region';
import { War } from '../../../entity/War';
import { calculateTroops } from './calculateTroops';

export function calculateDamage(
  player: Player,
  war: War,
  defend: boolean = true
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

  if (war.type === 'training') diffs = 0.75;

  if (defend) {
    if (['ground', 'troopers'].includes(war.type))
      diffs += point25(clamp(-0.75, missile_diff, 0));
    if (['ground', 'troopers', 'moon'].includes(war.type))
      diffs += point25(clamp(0, airport_diff, 0.75));
    if (['sea'].includes(war.type)) diffs += point25(clamp(-0.75, sea_diff, 0));

    if (war.aggressor instanceof Region) buffs += macademy_buff(war.aggressor);
    if (['revolution', 'coup'].includes(war.type)) {
      buffs += 0.05;
    } else {
      // buffs += war.aggressor.indexes['military'] / 20;
    }
  } else {
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

  const troops = calculateTroops(player, 300, war);
  const alpha = Object.keys(troops).reduce(
    (acc, troop) => acc + troops[troop] * troopAlphaDamage[troop],
    0
  );

  const tanks_ratio = (troops['tanks'] * troopAlphaDamage['tanks']) / alpha;
  const ships_ratio =
    (troops['battleships'] * troopAlphaDamage['battleships']) / alpha;
  const space_ratio =
    (troops['spaceStations'] * troopAlphaDamage['spaceStations']) / alpha;
  const drone_ratio =
    (troops['laserDrones'] * troopAlphaDamage['laserDrones']) / alpha;

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
