import invariant from 'tiny-invariant';
import { UserContext } from '../../../UserContext';
import { Law } from '../../../entity/shared/Parliament';
import { getStateInfo } from '../../getInfo/getStateInfo';
import { getParliamentInfo } from '../../getInfo/misc/getParliamentInfo';

export async function proLawByText(user: UserContext, text: string) {
  try {
    await getStateInfo(user, user.player.region!.state!.id, true);

    const capitalId = user.player.region!.state!.capital!.id;
    const parliament = await getParliamentInfo(user, capitalId);

    invariant(parliament, 'Failed to get parliament info');

    let isAccepted = false;
    for (const law of parliament.laws) {
      if (law.text.includes(text)) {
        await proLaw(user, capitalId, law);
        isAccepted = true;
        break;
      }
    }

    return isAccepted;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function proLaw(user: UserContext, capitalId: number, law: Law) {
  return await user.ajax(
    `/parliament/votelaw/${capitalId}/${law.by!.id}/${law.id}/pro`
  );
}

export async function cancelSelfLaw(user: UserContext) {
  return await user.ajax('/parliament/removelaw');
}
