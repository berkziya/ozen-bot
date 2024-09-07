import invariant from 'tiny-invariant';
import { User } from '../../../User';
import { Region } from '../../../entity/Region';
import { Law } from '../../../entity/shared/Parliament';
import { getStateInfo } from '../../getInfo/getStateInfo';
import { getParliamentInfo } from '../../getInfo/misc/getParliamentInfo';

export const resourceIds = {
  money: 1,
  gold: 0,
  oil: 3,
  ore: 4,
  uranium: 11,
  diamonds: 15,
};

export async function proLawByText(user: User, text: string) {
  await getStateInfo(user.player.region!.state!.id);

  const capital = user.player.region!.state!.capital!;
  const parliament = await getParliamentInfo(capital);

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
}

export async function proLaw(user: User, capital: Region, law: Law) {
  return await user.ajax(
    `/parliament/votelaw/${capital.id}/${law.by!.id}/${law.id}/pro`
  );
}

export async function cancelSelfLaw(user: User) {
  return await user.ajax('/parliament/removelaw');
}
