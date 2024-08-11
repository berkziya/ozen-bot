import { UserContext } from '../../UserContext';
import * as cheerio from 'cheerio';
import { dotless } from '../../misc/utils';

export async function getFactoryInfo(
  user: UserContext,
  factoryId: number,
  force?: boolean
) {
  const factory = await user.models.getFactory(factoryId);

  if (
    !force &&
    factory.lastUpdate &&
    Date.now() - factory.lastUpdate.getTime() < 20 * 60 * 1000
  ) {
    return factory;
  }

  const x = await fetch(`https://rivalregions.com/factory/index/${factoryId}`, {
    headers: {
      cookie: user.cookies,
    },
  });

  const content = await x.text();

  if (!content || content.length < 150) {
    return null;
  }

  const $ = cheerio.load(content);

  try {
    factory.name = $('body > div.margin > h1')
      .contents()
      .filter(function () {
        return this.type === 'text';
      })
      .first()
      .text()
      .trim();

    factory.type = $(
      'div.float_left > div.change_paper_about_target.float_left > span'
    )
      .text()
      .split(' ')[0];

    factory.level = dotless(
      $(
        'div.float_left > div.change_paper_about_target.float_left > span'
      ).text()
    );
    factory.owner = await user.models.getPlayer(
      $('span[action*="profile"]').attr('action')!.split('/').pop()!
    );
    factory.owner.setName($('span[action*="profile"]').text().trim());
    const region = await user.models.getRegion(
      $('span[action*="map"]').attr('action')!.split('/').pop()!
    );
    factory.setRegion(region);
    factory.region.name = $('span[action*="map"]').text().trim();
    factory.setWage($('h2[class$="imp"]').first().text());

    const potentialWage = dotless(
      $('h2[class$="imp"]').last().text().split(' ')[0]
    );
    if (potentialWage) {
      factory.potentialWage = potentialWage;
    }
  } catch (e) {
    console.error(e);
  }
  return factory;
}
