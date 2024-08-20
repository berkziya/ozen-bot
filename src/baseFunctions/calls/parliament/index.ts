import { UserContext } from '../../../UserContext';
import { Law } from '../../../entity/shared/Parliament';

export async function proLaw(user: UserContext, capitalId: number, law: Law) {
  return await user.ajax(
    `/parliament/votelaw/${capitalId}/${law.by?.id}/${law.id}/pro`
  );
}

export async function cancelSelfLaw(user: UserContext) {
  return await user.ajax('/parliament/removelaw');
}
