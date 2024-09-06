import { User } from '../../../User';
import { getPerkUpgradeTimes } from './perk';

export async function choosePerkToUpgrade(user: User, gold = ['str', 'edu']) {
  const times = getPerkUpgradeTimes(user);
  let { str, edu, end } = times;

  str /= 2;

  if (gold.includes('str')) str *= 0.075;
  if (gold.includes('edu')) edu *= 0.075;
  if (gold.includes('end')) end *= 0.075;

  if (str > edu && str > end) return { perk: 'str', time: str, gold };
  if (edu > end) return { perk: 'edu', time: edu, gold };
  return { perk: 'end', time: end, gold };
}
