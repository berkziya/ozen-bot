import invariant from 'tiny-invariant';
import { User } from '../../../User';
import { storageInfo } from '../../getInfo/misc/storageInfo';

export async function produceEnergy(
  user: User,
  amount?: number,
  target?: number,
  leaveAtLeastXGold = 0
) {
  if (target) {
    const storage = await storageInfo(user);
    invariant(storage, 'Failed to get storage info');
    const currentEnergy = user.player.storage.energyDrink;
    amount = target - currentEnergy;
  }
  invariant(amount, 'No amount specified');
  const currentGold = user.player.storage.gold;
  amount = Math.min(amount, (currentGold - leaveAtLeastXGold) * 10);
  amount = Math.floor(amount / 10) * 10;
  invariant(amount > 100, 'Invalid amount');
  return await user.ajax(`/storage/newproduce/17/${amount}`);
}
