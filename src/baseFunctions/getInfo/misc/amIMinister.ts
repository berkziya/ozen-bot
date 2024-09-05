import invariant from 'tiny-invariant';
import { UserContext } from '../../../UserContext';
import { getPlayerInfo } from '../getPlayerInfo';
import { getRegionInfo } from '../getRegionInfo';

export async function amIMinister(user: UserContext, playerId?: number) {
  if (!playerId) {
    playerId = user.player.id;
  }

  try {
    const player = await getPlayerInfo(user, playerId);
    invariant(player, 'Failed to get player info');
    const region = await getRegionInfo(user, player.region!.id);
    invariant(region, 'Failed to get region info');

    const toBeReturned: {
      leader: boolean;
      dicta: boolean;
      econ: boolean;
      foreign: boolean;
      governor: boolean;
    } = {
      leader: false,
      dicta: false,
      econ: false,
      foreign: false,
      governor: false,
    };

    toBeReturned.leader =
      (player.leaderOfState &&
        player.leaderOfState.id === user.player.region!.state?.id) ??
      false;
    if (toBeReturned.leader)
      toBeReturned.dicta =
        player.leaderOfState?.governmentForm === 'dictatorship';
    toBeReturned.econ =
      (player.econMinisterOfState &&
        player.econMinisterOfState.id === user.player.region!.state?.id) ??
      false;
    toBeReturned.foreign =
      (player.foreignMinisterOfState &&
        player.foreignMinisterOfState.id === user.player.region?.state?.id) ??
      false;
    toBeReturned.governor =
      (player.governorOfAuto &&
        player.governorOfAuto.id === user.player.region?.autonomy?.id) ??
      false;

    return toBeReturned;
  } catch (e) {
    console.error('Failed to get minister info:', e);
    return null;
  }
}
