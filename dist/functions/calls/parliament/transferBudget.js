import invariant from 'tiny-invariant';
import { proLawByText, resourceIds } from '.';
import { Autonomy } from '../../../entity/Autonomy';
import { Region } from '../../../entity/Region';
import { State } from '../../../entity/State';
import { getAutonomyInfo } from '../../getInfo/getAutonomyInfo';
import { getStateInfo } from '../../getInfo/getStateInfo';
import { amIMinister } from '../../getInfo/misc/amIMinister';
export async function transferBudget(user, target, resource, amount) {
    const ministerInfo = await amIMinister(user.id);
    invariant(ministerInfo, 'Failed to get minister info');
    if (!ministerInfo.econ || !(ministerInfo.leader && ministerInfo.dicta))
        return null;
    let targetCapitalId = 0;
    if (target instanceof State) {
        if (!getStateInfo(target.id)) {
            return 'Failed to get state info';
        }
        targetCapitalId = target.capital.id;
    }
    else if (target instanceof Autonomy) {
        if (!getAutonomyInfo(target.id)) {
            return 'Failed to get autonomy info';
        }
        targetCapitalId = target.capital.id;
    }
    else if (target instanceof Region) {
        targetCapitalId = target.id;
    }
    invariant(targetCapitalId, 'Failed to get the target capital');
    await user.ajax(`/parliament/donew/send_${resourceIds[resource]}/${amount}/${targetCapitalId}`, { tmp_gov: amount });
    const result = await proLawByText(user, 'Budget transfer');
    return result;
}
