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

  const content = await fetch(user.link + url, {
    headers: {
      cookie: user.cookies,
    },
  }).then((res) => res.text());

  if (!content || content.length < 150) return null;

  const parliament = new Parliament();
  parliament.isAutonomy = isAutonomy;
  parliament.capitalRegion = await user.models.getRegion(capitalId);

  const $ = cheerio.load(content);
  $('div.parliament_law').map(async (i, el) => {
    const action = $(el).attr('action')!.split('/');
    const lawId = parseInt(action[action.length - 1]);
    const by = parseInt(action[action.length - 2]);
    const text = $(el).find('div > span').text().trim();
    const law = new Law();
    law.id = lawId;
    law.by = await user.models.getPlayer(by);
    law.text = text;
    parliament.laws.push(law);
  });

  return parliament;
}
