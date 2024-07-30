// import { UserContext } from '../../..';
// import { Region, State } from '../../../models';
// import { getParliamentInfo, getPlayerInfo, getRegionInfo, getStateInfo } from '../../getInfo';

// export async function proLaw(user: UserContext, law: { capitalId: number, lawId: number, by: number, text: string; }) {
//   return await user.ajax(`/parliament/votelaw/${law.capitalId}/${law.by}/${law.lawId}/pro`);
// }

// export async function cancelSelfLaw(user: UserContext) {
//   return await user.ajax('/parliament/removelaw');
// }

// export async function transferBudget(user: UserContext, to: State | Region, resource: string, amount: number) {
//   const resource_Ids: { [key: string]: number; } = { "money": 1, "gold": 0, "oil": 3, "ore": 4, "uranium": 11, "diamonds": 15 };

//   if (!user) return 'You are not logged in';

//   if (!await getPlayerInfo(user, user.id, true)) {
//     return 'Failed to get player info';
//   }

//   if (!user.player.econState) return 'You are not in an economic state';

//   if (!await getRegionInfo(user, user.player.location!.id, true)) {
//     return 'Failed to get region info';
//   }

//   const econState = await getStateInfo(user, user.player.econState.id, true);

//   if (!econState) return 'Failed to get state info';

//   if (user.player.location!.state?.id !== econState.id) {
//     return 'You are not in the state';
//   }

//   if (econState.budget.resources[resource] < amount) {
//     return 'Not enough resources';
//   }

//   let id: number = 0;
//   if (to instanceof State) {
//     if (!getStateInfo(user, to.id, true)) {
//       return 'Failed to get state info';
//     }
//     id = to.capital!.id;
//   } else if (to instanceof Region) {
//     id = to.id;
//   }

//   if (!id) return 'Invalid target';

//   console.log(`Transfering ${amount} ${resource} to ${id}`);
//   const law = await user.ajax(
//     `/parliament/donew/send_${resource_Ids[resource]}/${amount}/${id}`,
//     `tmp_gov: '${amount}'`
//   );

//   const laws = await getParliamentInfo(user, econState.capital!.id);

//   if (!laws) return 'Failed to get parliament info';

//   console.log(laws);
//   let isAccepted = false;
//   laws.filter((law) => law.by === user.id).forEach((law) => {
//     proLaw(user, law);
//     isAccepted = true;
//   });

//   if (!isAccepted) return 'Failed to get accepted law';

//   return 'Success';
// }
