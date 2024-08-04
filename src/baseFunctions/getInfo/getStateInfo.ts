import { UserContext } from '../../Client';
import * as cheerio from 'cheerio';
import { toCamelCase, dotless } from '../../misc/utils';

export async function getStateInfo(
  user: UserContext,
  stateId: number,
  force?: boolean
) {
  const state = await user.models.getState(stateId);

  if (
    !force &&
    state.lastUpdate &&
    Date.now() - state.lastUpdate.getTime() < 60 * 10
  ) {
    return state;
  }

  // const url = '/map/state_details/' + stateId;
  // const { content } = await user.get(url);

  const x = await fetch(
    `https://rivalregions.com/map/state_details/${stateId}`,
    {
      headers: {
        cookie: user.cookie,
      },
    }
  );

  const content = await x.text();

  if (!content || content.length < 100) {
    return null;
  }

  // state.image = img;

  const $ = cheerio.load(content);

  state.name = $('body > div.margin > h1 > a').text().trim();

  const budgetDiv = $('div.slide_profile_photo > div.imp');
  state.storage.setBudgetFromDiv(budgetDiv);

  async function playerFromDiv(div: cheerio.Cheerio<cheerio.Element>) {
    const playerDiv = div.find('div[action*="profile"]');
    const player = await user.models.getPlayer(
      playerDiv.attr('action')?.split('/').pop()!
    );
    const playerName = playerDiv.text().match(/([^]*)Wage:/);
    player.setName(playerName ? playerName[1] : player.name);
    return player;
  }

  const divs = $('#region_scroll > div');
  for (let i = 0; i < divs.length; i++) {
    const div = divs.eq(i);
    const key = toCamelCase(div.find('h2').first().text());
    if (key === 'entryFee') {
      const fee = dotless(
        div.find('div.slide_profile_data > h2').first().text()
      );
      state.entryFee = fee;
    } else if (key === 'borders') {
      if (div.text().includes('open')) {
        state.bordersOpen = true;
      } else {
        state.bordersOpen = false;
      }
    } else if (key === 'residencyForWork') {
      if (div.text().includes('Not')) {
        state.needResidencyToWork = false;
      } else {
        state.needResidencyToWork = true;
      }
    } else if (key === 'residency') {
      if (div.text().includes('leader')) {
        state.residencyIssuedByLeader = true;
      } else {
        state.residencyIssuedByLeader = false;
      }
    } else if (key === 'governmentForm') {
      state.governmentForm = toCamelCase(div.find('span').first().text());
    } else if (key === 'stateLeader') {
      const leader = await playerFromDiv(div);
      state.setLeader(leader);
    } else if (
      key === 'leaderAndCommander' ||
      key === 'dictator' ||
      key === 'monarch'
    ) {
      const leader = await playerFromDiv(div);
      state.setLeader(leader);
      state.leaderIsCommander = true;
    } else if (key === 'economicAdviser' || key === 'ministerOfEconomics') {
      const econ = await playerFromDiv(div);
      state.setEconMinister(econ);
    } else if (key === 'foreignMinister') {
      const foreign = await playerFromDiv(div);
      state.setForeignMinister(foreign);
    } else if (key === 'stateRegions') {
      const regions = div.find('div[action^="map/details/"]').toArray();
      await Promise.all(
        regions.map(async (el, i) => {
          const region = await user.models.getRegion(
            $(el).attr('action')!.split('/').pop()!
          );
          region.name = $(el).text().trim();
          state.addRegion(region);
          if (i === 0) {
            state.setCapital(region);
          }
        })
      );
    }
  }
  state.lastUpdate = new Date();
  return state;
}
