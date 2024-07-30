import { UserContext } from '../../../Client';
import * as cheerio from 'cheerio';

export async function getParliamentInfo(
  user: UserContext,
  capitalId: number,
  isAutonomy: boolean = false
) {
  const url = isAutonomy
    ? 'parliament/auto/' + capitalId
    : 'parliament/index/' + capitalId;
  const { content } = await user.get(url);

  if (!content) {
    return null;
  }

  const $ = cheerio.load(content);
  const laws: { capitalId: number; lawId: number; by: number; text: string }[] =
    [];
  $('div.parliament_law').each((i, el) => {
    const action = $(el).attr('action')!.split('/');
    const lawId = parseInt(action[action.length - 1]);
    const by = parseInt(action[action.length - 2]);
    const text = $(el).find('div > span').text().trim();
    laws.push({ capitalId, lawId, by, text });
  });

  return laws;
}
