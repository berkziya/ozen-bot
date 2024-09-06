import { User } from '../../../User';
import { parseMarketData } from '../../getInfo/misc/parseMarketData';
import invariant from 'tiny-invariant';

const resourceToId = {
  oil: 3,
  ore: 4,
  uranium: 11,
  diamonds: 15,
  liquidOxygen: 21,
  helium3: 24,
  rivalium: 26,
  antirad: 13,
  energyDrink: 17,
  spaceRockets: 20,
  lss: 25,
  tanks: 2,
  aircrafts: 1,
  missiles: 14,
  bombers: 16,
  battleships: 18,
  laserDrones: 27,
  moonTanks: 22,
  spaceStations: 23,
};

export async function buyResource(
  user: User,
  resource: keyof typeof resourceToId,
  amount: number
) {
  const offers = await parseMarketData(user, resource);
  invariant(offers);
  const offer = offers[1];
  console.log(
    'buying ' +
      resource +
      ' from ' +
      offer.userId +
      ' at the price of ' +
      offer.price
  );
  user.ajax(
    `/storage/buy/${resourceToId[resource]}/${offer.userId}/${amount}/${offer.price}`
  );
}
