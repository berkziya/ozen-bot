import invariant from 'tiny-invariant';
import { UserContext } from '../../../UserContext';
import { Law } from '../../../entity/shared/Parliament';
import { getStateInfo } from '../../getInfo/getStateInfo';
import { getParliamentInfo } from '../../getInfo/misc/getParliamentInfo';
import { Region } from '../../../entity/Region';

export async function proLawByText(user: UserContext, text: string) {
  try {
    await getStateInfo(user, user.player.region!.state!.id, true);

    const capital = user.player.region!.state!.capital!;
    const parliament = await getParliamentInfo(user, capital);

    invariant(parliament, 'Failed to get parliament info');

    let isAccepted = false;
    for (const law of parliament.laws) {
      if (law.text.includes(text)) {
        await proLaw(user, capital, law);
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

export async function proLaw(user: UserContext, capital: Region, law: Law) {
  return await user.ajax(
    `/parliament/votelaw/${capital.id}/${law.by!.id}/${law.id}/pro`
  );
}

export async function cancelSelfLaw(user: UserContext) {
  return await user.ajax('/parliament/removelaw');
}
