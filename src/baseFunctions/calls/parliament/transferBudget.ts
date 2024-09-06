import invariant from 'tiny-invariant';
import { proLawByText, resourceIds } from '.';
import { Autonomy } from '../../../entity/Autonomy';
import { Region } from '../../../entity/Region';
import { State } from '../../../entity/State';
import { User } from '../../../User';
import { getAutonomyInfo } from '../../getInfo/getAutonomyInfo';
import { getStateInfo } from '../../getInfo/getStateInfo';
import { amIMinister } from '../../getInfo/misc/amIMinister';

export async function transferBudget(
  user: User,
  target: State | Region | Autonomy,
  resource: keyof typeof resourceIds,
  amount: number
) {
  try {
    const ministerInfo = await amIMinister(user);
    invariant(ministerInfo, 'Failed to get minister info');

    invariant(ministerInfo.econ, 'Not the Econ Minister');
    invariant(ministerInfo.leader && ministerInfo.dicta, 'Not the Dictator');

    let targetCapitalId: number = 0;
    if (target instanceof State) {
      if (!getStateInfo(user, target.id, true)) {
        return 'Failed to get state info';
      }
      targetCapitalId = target.capital!.id;
    } else if (target instanceof Autonomy) {
      if (!getAutonomyInfo(user, target.id)) {
        return 'Failed to get autonomy info';
      }
      targetCapitalId = target.capital!.id;
    } else if (target instanceof Region) {
      targetCapitalId = target.id;
    }

    invariant(targetCapitalId, 'Failed to get the target capital');

    await user.ajax(
      `/parliament/donew/send_${resourceIds[resource]}/${amount}/${targetCapitalId}`,
      { tmp_gov: amount }
    );

    const result = await proLawByText(user, 'Budget transfer');

    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
}
