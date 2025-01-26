import { User } from '../../../user/User';

export const DEPT_IDS = {
  buildings: 1,
  gold: 2,
  oil: 3,
  ore: 4,
  diamonds: 5,
  uranium: 6,
  liquidOxygen: 7,
  helium3: 8,
  tanks: 9,
  spaceStations: 10,
  battleships: 11,
};

export async function workStateDept(
  user: User,
  dept: keyof typeof DEPT_IDS = 'tanks'
) {
  const toBeWorked = Object.entries(DEPT_IDS).reduce(
    (acc, [key, value]) => ({ ...acc, [`w${value}`]: dept == key ? 10 : 0 }),
    { state: user.player.region!.state!.id }
  );
  const what = JSON.stringify(toBeWorked);
  return await user.ajax('/rival/instwork', { what });
}
