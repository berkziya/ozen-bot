import { User } from '../../../User';

const perkToId = { str: 1, edu: 2, end: 3 };
const currencyToId = { money: 1, gold: 2 };

export function getPerkUpgradeTimes(user: User) {
  const { perks } = user.player;
  const times: {
    str: number;
    edu: number;
    end: number;
  } = { str: 0, edu: 0, end: 0 };

  for (const [key, value] of Object.entries(perks)) {
    let time = (value + 1) ** 2;
    if (value < 50) time /= 2;
    if (value < 100) time /= 2;
    times[key as keyof typeof times] = time;
  }

  return times;
}

export async function upgradePerk(
  user: User,
  perk: keyof typeof perkToId,
  currency: keyof typeof currencyToId = 'money'
) {
  return await user.ajax(
    `/perks/up/${perkToId[perk]}/${currencyToId[currency]}`
  );
}
