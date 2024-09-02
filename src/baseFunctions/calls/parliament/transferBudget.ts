import invariant from 'tiny-invariant';
import { Autonomy } from '../../../entity/Autonomy';
import { Region } from '../../../entity/Region';
import { State } from '../../../entity/State';
import { UserContext } from '../../../UserContext';
import { getAutonomyInfo } from '../../getInfo/getAutonomyInfo';
import { getStateInfo } from '../../getInfo/getStateInfo';
import { amIMinister } from '../../getInfo/misc/amIMinister';
import { proLawByText } from '.';

const resourceIds = {
  money: 1,
  gold: 0,
  oil: 3,
  ore: 4,
  uranium: 11,
  diamonds: 15,
};

export async function transferBudget(
  user: UserContext,
  to: State | Region | Autonomy,
  resource: keyof typeof resourceIds,
  amount: number
) {
  try {
    const ministerInfo = await amIMinister(user);
    invariant(ministerInfo, 'Failed to get minister info');

    if (!ministerInfo.econ || (!ministerInfo.leader && ministerInfo.dicta)) {
      return "You don't have permission to transfer budget";
    }

    let capitalId: number = 0;
    if (to instanceof State) {
      if (!getStateInfo(user, to.id, true)) {
        return 'Failed to get state info';
      }
      capitalId = to.capital!.id;
    } else if (to instanceof Autonomy) {
      if (!getAutonomyInfo(user, to.id)) {
        return 'Failed to get autonomy info';
      }
      capitalId = to.capital!.id;
    } else if (to instanceof Region) {
      capitalId = to.id;
    }

    invariant(capitalId, 'Failed to get id');

    console.log(`Transfering ${amount} ${resource} to ${to}`);

    await user.ajax(
      `/parliament/donew/send_${resourceIds[resource]}/${amount}/${capitalId}`,
      { tmp_gov: amount }
    );

    const result = await proLawByText(user, 'Budget transfer');

    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
}
