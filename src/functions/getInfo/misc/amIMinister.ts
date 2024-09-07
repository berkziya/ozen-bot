import invariant from 'tiny-invariant';
import { getPlayerInfo } from '../getPlayerInfo';
import { getRegionInfo } from '../getRegionInfo';

export async function amIMinister(playerId: number) {
  const player = await getPlayerInfo(playerId);
  invariant(player, 'Failed to get player info');
  const region = await getRegionInfo(player.region!.id);
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
      player.leaderOfState.id === player.region!.state?.id) ??
    false;
  if (toBeReturned.leader)
    toBeReturned.dicta =
      player.leaderOfState?.governmentForm === 'dictatorship';
  toBeReturned.econ =
    (player.econMinisterOfState &&
      player.econMinisterOfState.id === player.region!.state?.id) ??
    false;
  toBeReturned.foreign =
    (player.foreignMinisterOfState &&
      player.foreignMinisterOfState.id === player.region?.state?.id) ??
    false;
  toBeReturned.governor =
    (player.governorOfAuto &&
      player.governorOfAuto.id === player.region?.autonomy?.id) ??
    false;

  return toBeReturned;
}
