import { proLawByText, resourceIds } from '.';
import { UserContext } from '../../../UserContext';
import { amIMinister } from '../../getInfo/misc/amIMinister';
import invariant from 'tiny-invariant';

export async function resourceRefill(
  user: UserContext,
  resource: keyof typeof resourceIds = 'gold'
) {
  try {
    const ministerInfo = await amIMinister(user);
    invariant(ministerInfo, 'Failed to get minister info');

    invariant(ministerInfo.econ, 'Not the Econ Minister');
    invariant(
      ministerInfo.econ || !(ministerInfo.leader && ministerInfo.dicta),
      'Not the Dictator'
    );

    await user.ajax(`/parliament/donew/42/${resourceIds[resource]}/0`);

    const result = await proLawByText(user, 'Resources exploration');

    return result;
  } catch (e) {
    console.error(e);
  }
}
