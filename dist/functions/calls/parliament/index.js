import invariant from 'tiny-invariant';
import { getStateInfo } from '../../getInfo/getStateInfo';
import { getParliamentInfo } from '../../getInfo/misc/getParliamentInfo';
export { resourceRefill } from './resourceRefill';
export { transferBudget } from './transferBudget';
export const resourceIds = {
    money: 1,
    gold: 0,
    oil: 3,
    ore: 4,
    uranium: 11,
    diamonds: 15,
};
export async function proLawByText(user, text) {
    await getStateInfo(user.player.region.state.id);
    const capital = user.player.region.state.capital;
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
export async function proLaw(user, capital, law) {
    return await user.ajax(`/parliament/votelaw/${capital.id}/${law.by.id}/${law.id}/pro`);
}
export async function cancelSelfLaw(user) {
    return await user.ajax('/parliament/removelaw');
}
