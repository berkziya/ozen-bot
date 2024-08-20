import invariant from 'tiny-invariant';
import { UserContext } from '../../../UserContext';
import { storageInfo } from '../../getInfo/misc/storageInfo';
import { Storage } from '../../../entity/shared/Storage';

export async function produceEnergy(
  user: UserContext,
  amount?: number,
  target?: number,
  leaveAtLeastXGold: number = 0
) {
  try {
    if (target) {
      const storage: Storage | null = await storageInfo(user);
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
  } catch (e) {
    console.error(e);
    return null;
  }
}