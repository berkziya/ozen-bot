import * as cheerio from 'cheerio';

import { Region } from '../../../entity/Region';
import { UserHandler } from '../../../UserHandler';
import invariant from 'tiny-invariant';
import { dotless } from '../../../misc/utils';

function parseTime(x: any) {
  return (
    parseInt(x[1] ?? '0') * 3600 + parseInt(x[2] ?? '0') * 60 + parseInt(x[3])
  );
}

export async function flightPrices(location: Region) {
  const user = UserHandler.getInstance().getUser();
  invariant(user, 'Failed to get user');

  const content = await user.get(`/map/region_data/${location.id}`);

  if (!content || content.length < 150) return null;

  const $ = cheerio.load(content);

  const prices: {
    [key: number]: { price: number; time: number; bordersOpen: boolean };
  } = {
    1: { price: 0, time: 0, bordersOpen: true },
    2: { price: 0, time: 0, bordersOpen: true },
  };

  // Get data from scripts
  $('script').each((_i, el) => {
    const script = $(el).html();
    if (script) {
      const flightTimes = [
        ...script.matchAll(
          /\$\('\.type_distance'\)\.html\('([0-2][0-9])?:?([0-5][0-9])?:?([0-5][0-9])'\);/g
        ),
      ];
      invariant(flightTimes, 'Failed to get flight times');
      if (flightTimes[0]) prices[1].time = parseTime(flightTimes[0]);
      if (location.id > 200000 && location.id < 200073) {
        prices[1].price = 5e9;
      } else {
        const flightPrices = script.match(
          /\$\('#move_here'\)\.html\('([0-9.]+) \$'\);/g
        );
        invariant(flightPrices, 'Failed to get flight prices');
        if (flightPrices[0]) prices[1].price = dotless(flightPrices[0]);

        if (flightTimes[1]) prices[2].time = parseTime(flightTimes[1]);
        if (flightPrices[1]) prices[2].price = dotless(flightPrices[1]);
      }
    }
  });

  if ($.html().includes('button_red')) {
    prices[1].bordersOpen = false;
    prices[2].bordersOpen = false;
  }
  return prices[1].price ? prices : null;
}
