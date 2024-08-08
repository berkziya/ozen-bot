import { UserContext } from '../../../Client';
import * as cheerio from 'cheerio';
import { dotless } from '../../../misc/utils';

export async function mainPageInfo(user: UserContext) {
  const x = await fetch('https://rivalregions.com/main/content', {
    headers: {
      cookie: user.cookies,
    },
  });

  const content = await x.text();

  if (!content || content.length < 100) {
    return null;
  }

  const $ = cheerio.load(content);

  const toBeReturned: { [key: string]: any } = {};

  // Get data from scripts
  $('script').each((i, el) => {
    const script = $(el).html();
    if (script) {
      // Get training war id
      const trainingWarId = script.match(/slide_header\('war\/details\/(d+)/);
      if (trainingWarId) {
        toBeReturned['trainingWarId'] = trainingWarId[1];
      }
      // Current player id
      const playerId = script.match(/slide_header\('slide\/profile\/(d+)/);
      if (playerId) {
        toBeReturned['playerId'] = playerId[1];
      }
      // Next free hit
      const hitCountdown = script.match(/.war_index_war_countdown/);
      if (hitCountdown) {
        const hitCountdownSeconds = script.match(/until: (\d+)/);
        if (hitCountdownSeconds) {
          toBeReturned['hitCountdown'] = parseInt(hitCountdownSeconds[1]);
        }
      }
      // Current money and gold
      const money = script.match(/new_m\('([0-9.]+)'\);/);
      if (money) {
        toBeReturned['money'] = dotless(money[1]);
        user.player.storage.money = dotless(money[1]);
      }
      const gold = script.match(/new_g\('([0-9.]+)'\);/);
      if (gold) {
        toBeReturned['gold'] = dotless(gold[1]);
        user.player.storage.gold = dotless(gold[1]);
      }
    }
  });

  // Current state
  const stateDiv = $(
    '#index_region > div:nth-child(2) > div[action^="map/state_details/"]'
  );
  const stateId = stateDiv.attr('action')!.split('/').pop()!;
  let stateName = stateDiv.text().replace('State:', '').trim();
  stateName = stateName.replace(/\s+/g, ' ').trim();
  const state = await user.models.getState(stateId);
  state.name = stateName;
  toBeReturned['state'] = state;

  // Current region
  const regionDiv = $(
    '#index_region > div:nth-child(3) > div > span[action^="map/details/"]'
  );
  const regionId = regionDiv.attr('action')!.split('/').pop()!;
  const regionName = regionDiv.text().trim();
  const region = await user.models.getRegion(regionId);
  region.name = regionName;
  user.player.setRegion(region);
  region.setState(state);
  toBeReturned['region'] = region;

  // Current auto war
  try {
    const autoWarSpan = $(
      'div.war_index_war > div:nth-child(1) > span:nth-child(4)'
    );
    if (autoWarSpan.text() == 'auto') {
      const autoWarId = autoWarSpan.attr('action')!.split('/').pop()!;
      toBeReturned['autoWarId'] = autoWarId;
    }
  } catch {}

  return toBeReturned;
}
