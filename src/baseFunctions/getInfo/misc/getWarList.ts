import { Region } from '../../../entity/Region';
import { War } from '../../../entity/War';
import { UserContext } from '../../../UserContext';
import * as cheerio from 'cheerio';

export async function getWarList(user: UserContext, stateId: number) {
  // if (user.isMobile) {
  //   return await mobileWarList(user, stateId);
  // }
  return await desktopWarList(user, stateId);
}

async function desktopWarList(user: UserContext, stateId: number) {
  const content = await user.get('/listed/statewars/' + stateId);

  if (!content || content.length < 150) return null;

  const $ = cheerio.load(content);

  const wars: Set<War> = new Set();

  async function tdToRegion(td: cheerio.Cheerio<cheerio.Element>) {
    const regionId = parseInt(td.attr('action')!.split('/').pop()!);
    if (!regionId) {
      if (td.text()!.includes('Coup')) {
        return 'coup';
      }
      return 'revolution';
    }
    const region = await user.models.getRegion(regionId);

    const stateDiv = td.find('div[action^="map/state"]');
    const stateId = parseInt(stateDiv.attr('action')!.split('/').pop()!);
    const state = await user.models.getState(stateId);

    const regionName = stateDiv.attr('title')!;
    const stateName = td.find('span').text().replace(regionName, '').trim();

    region.name = regionName!;
    region.setState(state);
    state.name = stateName;
    return region;
  }

  const warTrs = $('tbody > tr');

  for (let i = 0; i < warTrs.length; i++) {
    const warTr = warTrs.eq(i);

    const warId = parseInt(warTr.find('div[url]').attr('url')!);
    const war = await user.models.getWar(warId);

    const attackerRegion = await tdToRegion(
      warTr.find('td[action^="map/details"]').first()
    );
    const defenderRegion = await tdToRegion(
      warTr.find('td[action^="map/details"]').last()
    );
    war.aggressor = attackerRegion;
    war.defender = defenderRegion as Region;

    if (war.aggressor === 'coup' || war.aggressor === 'revolution') {
      war.type = war.aggressor;
    }

    // war.diff = parseInt(warTr.find('td[rat][action]').first().attr('rat')!);

    war.endingTime = new Date(
      parseInt(warTr.find('td[rat]').last().attr('rat')!)
    );

    wars.add(war);
  }
  return [...wars];
}

// async function mobileWarList(user: UserContext, stateId: number) {
//   const content = await user.get('/listed/statewars/' + stateId);

//   if (!content || content.length < 150) return null;

//   const $ = cheerio.load(content);
// }
