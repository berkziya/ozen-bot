import { Region } from '../../../entity/Region';
import { User } from '../../../User';

export async function cancelMove(user: User) {
  return await user.ajax('/map/cancel_move');
}

export async function moveTo(user: User, region: Region, fast = false) {
  return await user.ajax(`/map/region_move/${region.id}`, {
    type: fast ? 2 : 1,
    b: 1,
  });
}

export async function buildMilitaryAcademy(user: User) {
  return await user.ajax('/slide/academy_do/');
}
