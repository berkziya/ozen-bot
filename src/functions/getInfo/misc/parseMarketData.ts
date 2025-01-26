import * as cheerio from 'cheerio';
import invariant from 'tiny-invariant';
import UserService from '../../../user/UserService';

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

export async function parseMarketData(resource: keyof typeof resourceToId) {
  const user = UserService.getInstance().getUser();
  invariant(user, 'Failed to get user');

  const content = await user.get('/storage/listed/' + resourceToId[resource]);

  if (!content || content.length < 150) return null;

  const $ = cheerio.load(content);

  const listings = $('tr[user]');

  const parsedOffers: { userId: number; amount: number; price: number }[] = [];
  for (let i = 0; i < listings.length; i++) {
    const offer = listings.eq(i);
    const offerById = parseInt(offer.attr('user')!);
    // const offerByName = offer
    //   .find('span[action^="slide/profile/]')
    //   .first()
    //   .text();
    // const offerLocationId = offer
    //   .find('span[action^="map/details/]')
    //   .first()
    //   .attr('action')!
    //   .split('/')
    //   .pop();
    const offerAmount = parseInt(offer.find('td:nth-child(4)').attr('rat')!);
    const offerPrice = parseInt(offer.find('td:nth-child(5)').attr('rat')!);
    parsedOffers.push({
      userId: offerById,
      // userName: offerByName,
      // locationId: offerLocationId,
      amount: offerAmount,
      price: offerPrice,
    });
  }

  return parsedOffers;
}
