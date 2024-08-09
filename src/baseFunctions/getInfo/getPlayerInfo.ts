import { UserContext } from '../../UserContext';
import * as cheerio from 'cheerio';
import { dotless, toCamelCase } from '../../misc/utils';
import { getRegionInfo } from './getRegionInfo';

export async function getPlayerInfo(
  user: UserContext,
  playerId: number,
  force?: boolean
) {
  const player = await user.models.getPlayer(playerId);

  if (
    !force &&
    player.lastUpdate &&
    Date.now() - player.lastUpdate.getTime() < 60 * 3
  ) {
    return player;
  }

  const x = await fetch(`https://rivalregions.com/slide/profile/${playerId}`, {
    headers: {
      cookie: user.cookies,
    },
  });

  const content = await x.text();

  if (!content || content.length < 100) {
    return null;
  }

  player.leaderOfState = null;
  player.econMinisterOfState = null;
  player.foreignMinisterOfState = null;
  player.governorOfAuto = null;
  player.statePermits = new Set();
  player.regionPermits = new Set();

  const $ = cheerio.load(content);

  const nameMatch = $('body > div.margin > h1')
    .text()
    .match(/Profile: (.*)/);
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  nameMatch && player.setName(nameMatch[1].trim());

  const levelMatch = $('div[action="listed/gain"]')
    .text()
    .match(/Level: (.*)/);
  if (levelMatch) {
    player.level = parseInt(levelMatch[1]);
  }

  const expMatch = $('div[action="listed/gain"]')
    .attr('title')!
    .match(/Exp:(.*)Next/);
  if (expMatch) {
    player.exp = dotless(expMatch[1]);
  }

  const leaderDiv = $('h2[title*="eader"]');
  if (leaderDiv.length) {
    const leadingStateId = leaderDiv.attr('action')!.split('/').pop()!;
    const leadingState = await user.models.getState(leadingStateId);
    leadingState.name = leaderDiv.text().trim();
    player.setLeader(leadingState);
    if (leaderDiv.attr('title')?.includes('ommand')) {
      leadingState.leaderIsCommander = true;
    }
  }

  const trs = $('tbody > tr');
  for (let i = 1; i < trs.length; i++) {
    const tr = trs.eq(i);
    const key = toCamelCase(tr.find('td').first().text());
    const value = tr.find('td').last().text();
    if (key === 'perks') {
      const perks = value.split(' / ').map((perk) => {
        return parseInt(perk);
      });
      player.perks['str'] = perks[0];
      player.perks['edu'] = perks[1];
      player.perks['end'] = perks[2];
    } else if (key === 'region' || key === 'residency') {
      const regionDiv = tr.find('div[action^="map/details/"]').first();
      const regionId = regionDiv.attr('action')!.split('/').pop()!;
      const region = await user.models.getRegion(regionId);
      if (key === 'region') {
        player.setRegion(region);
      } else {
        player.setResidency(region);
      }
      region.name = regionDiv.text().trim();
    } else if (key === 'workPermit') {
      const states = tr.find('[action*="state"]').toArray();
      await Promise.all(
        states.map(async (el) => {
          const state = await user.models.getState(
            $(el).attr('action')!.split('/').pop()!
          );
          state.name = $(el).text().trim();
          player.addStatePermit(state);
        })
      );
      const regions = tr.find('[action^="map/details"]').toArray();
      await Promise.all(
        regions.map(async (el) => {
          const region = await user.models.getRegion(
            $(el).attr('action')!.split('/').pop()!
          );
          region.name = $(el).text().trim();
          player.addRegionPermit(region);
        })
      );
    } else if (
      key === 'governor' ||
      key === 'ministerOfEconomics' ||
      key === 'economicAdviser' ||
      key === 'foreignMinister'
    ) {
      const id = tr
        .find('div[action^="map/"]')
        .attr('action')!
        .split('/')
        .pop()!;
      const name = tr.find('div[action^="map/"]').text().trim();
      switch (key) {
        case 'governor': {
          const region = await getRegionInfo(user, parseInt(id));
          const autonomy = region!.autonomy!;
          autonomy.name = name;
          player.setGovernor(autonomy);
          autonomy.setCapital(region!);
          break;
        }
        case 'ministerOfEconomics':
        case 'economicAdviser': {
          const econState = await user.models.getState(id);
          player.setEcon(econState);
          econState.name = name;
          break;
        }
        case 'foreignMinister': {
          const foreignState = await user.models.getState(id);
          player.setForeign(foreignState);
          foreignState.name = name;
          break;
        }
      }
    }
  }
  player.lastUpdate = new Date();
  return player;
}
