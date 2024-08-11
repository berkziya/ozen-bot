import { UserContext } from '../../UserContext';
import * as cheerio from 'cheerio';
import { dotless } from '../../misc/utils';
import { getTimestamp } from '../../misc/timestamps';

export async function getWarInfo(
  user: UserContext,
  id: number,
  force: boolean = false
) {
  const war = await user.models.getWar(id);

  if (
    !force &&
    war.lastUpdate &&
    Date.now() - war.lastUpdate.getTime() < 1 * 60 * 1000
  ) {
    return war;
  }

  const x = await fetch(`https://rivalregions.com/war/details/${id}`, {
    headers: {
      cookie: user.cookies,
    },
  });

  const content = await x.text();

  if (!content || content.length < 150) {
    return null;
  }

  const $ = cheerio.load(content);

  const typeElement = $('body > div.margin > h1 > div:nth-child(2)');
  let type = typeElement.text();

  if (type.includes('Troopers')) {
    type = 'troopers';
  } else if (type.includes('Sea')) {
    type = 'sea';
  } else if (type.includes('training')) {
    type = 'training';
  } else {
    const revolutionCoupElement = $('#war_w_ata > div > span.no_pointer');
    if (revolutionCoupElement.length) {
      if (type.includes('Revolution')) {
        type = 'revolution';
      } else if (type.includes('Coup')) {
        type = 'coup';
      } else {
        throw new Error(`Error getting war type: ${type}`);
      }
    } else {
      type = 'ground';
    }
  }

  war.type = type as typeof war.type;

  const timeStr = $('body > div.margin > h1 > div.small').text();
  war.endingTime = getTimestamp(timeStr);

  if (!['revolution', 'coup', 'training'].includes(type)) {
    const attackerId = $('#war_w_ata_s > div.imp > span:nth-child(3)')
      .attr('action')!
      .split('/')
      .pop()!;
    const aggressor = await user.models.getRegion(parseInt(attackerId));
    war.aggressor = aggressor;
  } else {
    const aggressor = await user.models.getRegion(0);
    war.aggressor = aggressor;
  }

  if (type === 'training') {
    war.lastUpdate = new Date();
    war.name = 'training war';
    return war;
  }

  const defenderId = $('#war_w_def_s > span:nth-child(3)')
    .attr('action')!
    .split('/')
    .pop()!;
  const defender = await user.models.getRegion(parseInt(defenderId));
  war.defender = defender;

  const attackerDamageSelector =
    type === 'revolution' || type === 'coup'
      ? '#war_w_ata > div.imp > span.hov2 > span'
      : '#war_w_ata_s > div.imp > span:nth-child(5) > span';

  war.aggressorDamage = dotless($(attackerDamageSelector).text());
  war.defenderDamage = dotless(
    $('#war_w_def_s > span:nth-child(5) > span').text()
  );

  war.lastUpdate = new Date();
  return war;
}
