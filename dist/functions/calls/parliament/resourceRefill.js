import invariant from 'tiny-invariant';
import { proLawByText, resourceIds } from '.';
import { amIMinister } from '../../getInfo/misc/amIMinister';
export async function resourceRefill(user, resource = 'gold') {
    const ministerInfo = await amIMinister(user.id);
    invariant(ministerInfo, 'Failed to get minister info');
    if (!ministerInfo.econ && !(ministerInfo.leader && ministerInfo.dicta))
        return null;
    await user.ajax(`/parliament/donew/42/${resourceIds[resource]}/0`);
    const result = await proLawByText(user, 'Resources exploration');
    return result;
}
