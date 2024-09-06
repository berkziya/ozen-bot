import * as cheerio from 'cheerio';
import { Region } from '../../../entity/Region';
import { Law, Parliament } from '../../../entity/shared/Parliament';
import { User } from '../../../User';

export async function getParliamentInfo(
  user: User,
  capital: Region,
  isAutonomy: boolean = false
) {
  const url = isAutonomy
    ? '/parliament/auto/' + capital.id
    : '/parliament/index/' + capital.id;

  const content = await user.get(url);

  if (!content || content.length < 150) return null;

  const parliament = new Parliament();
  parliament.isAutonomy = isAutonomy;
  parliament.capitalRegion = capital;

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
