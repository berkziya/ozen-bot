import { UserContext } from '../../../UserContext';
import * as cheerio from 'cheerio';
import { dotless } from '../../../misc/utils';
import { getTimestamp } from '../../../misc/timestamps';

export async function mainPageInfo(user: UserContext) {
  const x = await fetch('https://rivalregions.com/main/content', {
    headers: { cookie: user.cookies },
  });

  const content = await x.text();
  if (!content || content.length < 100) return null;

  const $ = cheerio.load(content);
  const toBeReturned: { [key: string]: any } = {};

  // Get data from scripts
  $('script').each((_i, el) => {
    const script = $(el).html();
    if (script) {
      const trainingWarId = script.match(/slide_header\('war\/details\/(\d+)/);
      if (trainingWarId) toBeReturned['trainingWarId'] = trainingWarId[1];

      const playerId = script.match(/slide_header\('slide\/profile\/(\d+)/);
      if (playerId) toBeReturned['playerId'] = playerId[1];

      const hitCountdownSeconds = script.match(/until: (\d+)/);
      if (hitCountdownSeconds)
        toBeReturned['hitCountdown'] = parseInt(hitCountdownSeconds[1]);

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
  const stateName = stateDiv
    .text()
    .replace('State:', '')
    .trim()
    .replace(/\s+/g, ' ');
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

  const index_regionDiv = $('#index_region');

  // Am I moving?
  try {
    const movingDiv = index_regionDiv.find('div.small.white > div');
    const movingText = movingDiv.text();
    const movingMatch = movingText.match(
      /(Moving in|Travelling back).*until (\w+ \d+:\d+)/
    );
    if (movingMatch) {
      const [_, movingType, date] = movingMatch;
      const timestamp = getTimestamp(date);
      if (movingType.includes('Moving in')) {
        toBeReturned['moving'] = true;
        toBeReturned['movingToId'] = movingDiv
          .find('span')
          .attr('action')!
          .split('/')
          .pop()!;
        toBeReturned['movingTime'] = timestamp;
      } else if (movingType.includes('Travelling back')) {
        toBeReturned['movingBack'] = true;
        toBeReturned['movingBackTime'] = timestamp;
      }
    } else {
      toBeReturned['moving'] = false;
      toBeReturned['movingBack'] = false;
    }
  } catch {}

  // Not residency
  if (index_regionDiv.text().includes('Request residency')) {
    toBeReturned['notResidency'] = true;
  }

  return toBeReturned;
}
