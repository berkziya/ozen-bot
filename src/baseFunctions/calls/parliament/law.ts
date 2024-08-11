import invariant from 'tiny-invariant';
import { UserContext } from '../../../UserContext';
import { Region } from '../../../entity/Region';
import { State } from '../../../entity/State';
import { Law } from '../../../entity/shared/Parliament';
import { amIMinister } from '../../getInfo/misc/amIMinister';
import { getStateInfo } from '../../getInfo/getStateInfo';
import { getParliamentInfo } from '../../getInfo/misc/getParliamentInfo';
import { Autonomy } from '../../../entity/Autonomy';
import { getAutonomyInfo } from '../../getInfo/getAutonomyInfo';

export async function proLaw(user: UserContext, capitalId: number, law: Law) {
  return await user.ajax(
    `/parliament/votelaw/${capitalId}/${law.by?.id}/${law.id}/pro`
  );
}

export async function cancelSelfLaw(user: UserContext) {
  return await user.ajax('/parliament/removelaw');
}

export async function transferBudget(
  user: UserContext,
  to: State | Region | Autonomy,
  resource: string,
  amount: number
) {
  const resource_Ids: { [key: string]: number } = {
    money: 1,
    gold: 0,
    oil: 3,
    ore: 4,
    uranium: 11,
    diamonds: 15,
  };

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

  const law = await user.ajax(
    `/parliament/donew/send_${resource_Ids[resource]}/${amount}/${capitalId}`,
    `tmp_gov: '${amount}'`
  );

  const parliament = await getParliamentInfo(
    user,
    user.player.region!.state!.capital!.id
  );

  invariant(parliament, 'Failed to get parliament info');

  let isAccepted = false;
  for (const law of parliament.laws) {
    if (law.by.id === user.id) {
      await proLaw(user, capitalId, law);
      isAccepted = true;
    }
  }

  invariant(isAccepted, 'Failed to accept law');

  return true;
}
