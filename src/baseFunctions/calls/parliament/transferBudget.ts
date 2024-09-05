import invariant from 'tiny-invariant';
import { Autonomy } from '../../../entity/Autonomy';
import { Region } from '../../../entity/Region';
import { State } from '../../../entity/State';
import { UserContext } from '../../../UserContext';
import { getAutonomyInfo } from '../../getInfo/getAutonomyInfo';
import { getStateInfo } from '../../getInfo/getStateInfo';
import { amIMinister } from '../../getInfo/misc/amIMinister';
import { proLawByText, resourceIds } from '.';

export async function transferBudget(
  user: UserContext,
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

    console.log(`Transfering ${amount} ${resource} to ${target}`);

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
