import { UserContext } from '../../../UserContext';
import * as cheerio from 'cheerio';
import { Law, Parliament } from '../../../entity/shared/Parliament';

export async function getParliamentInfo(
  user: UserContext,
  capitalId: number,
  isAutonomy: boolean = false
) {
  const url = isAutonomy
    ? '/parliament/auto/' + capitalId
    : '/parliament/index/' + capitalId;

  const content = await user.get(url);

  if (!content || content.length < 150) return null;

  const parliament = new Parliament();
  parliament.isAutonomy = isAutonomy;
  parliament.capitalRegion = await user.models.getRegion(capitalId);

  const $ = cheerio.load(content);

  for (const el of $('div.parliament_law')) {
    const action = $(el).attr('action')!.split('/');
    const [lawId, byId] = action.reverse();
    const text = $(el).find('div.parliament_sh1').text().trim();
    const law = new Law();
    law.id = parseInt(lawId);
    law.by = await user.models.getPlayer(byId);
    law.text = text;
    parliament.laws.push(law);
  }

  return parliament;
}
