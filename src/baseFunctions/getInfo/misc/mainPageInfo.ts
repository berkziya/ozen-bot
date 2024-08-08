import { UserContext } from '../../../Client';
import * as cheerio from 'cheerio';

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

  // Get data from scripts
  $('script').each((i, el) => {
    const script = $(el).html();
    if (script) {
      // Get training war id
      const trainingWarId = script.match(/slide_header('war\/details\/\(d+)/);
      if (trainingWarId) {
        console.log(trainingWarId[1]);
      }
      // Current player id
      const playerId = script.match(/slide_header('slide\/profile\/\(d+)/);
      if (playerId) {
        console.log(playerId[1]);
      }
      // Next free hit
      const hitCountdown = script.match(/.war_index_war_countdown/);
      if (hitCountdown) {
        const hitCountdownSeconds = script.match(/until: (\d+)/);
        if (hitCountdownSeconds) {
          console.log(hitCountdownSeconds[1]);
        }
      }
      // Current money and gold
      const money = script.match(/new_m\('([0-9.]+)'\);/);
      if (money) {
        console.log(money[1]);
      }
      const gold = script.match(/new_g\('([0-9.]+)'\);/);
      if (gold) {
        console.log(gold[1]);
      }
    }
  });

  // Current state
  const stateDiv = $(
    '#index_region > div:nth-child(2) > div[action^="map/state_details/"]'
  );
  const stateId = stateDiv.attr('action')!.split('/').pop()!;
  const stateName = stateDiv.text().replace('State: ', '').trim();
  const state = await user.models.getState(stateId);
  state.name = stateName;

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

  // Current auto war
  const autoWarSpan = $('div.war_index_war > div:nth-child(1) > span').last();
  if (autoWarSpan.text() == 'auto') {
    const autoWarId = autoWarSpan.attr('action')!.split('/').pop()!;
    console.log(autoWarId);
  }

  console.log(state.toJSON());
  console.log(region.toJSON());
}
