import { Factory, factoryIds } from '../../../entity/Factory';
import { State } from '../../../entity/State';
import { Region } from '../../../entity/Region';
import { User } from '../../../User';
import * as cheerio from 'cheerio';

export async function getFactoryList(
  user: User,
  location: State | Region,
  resource: keyof typeof factoryIds = 'gold'
) {
  const resourceId = factoryIds[resource];

  const link =
    location instanceof State
      ? `/factory/state/${location.id}/0/${resourceId}/`
      : `/factory/search/${location.id}/0/${resourceId}/`;

  const content = await user.get(link);

  if (!content || content.length < 150) return null;

  const $ = cheerio.load(content);

  const factories: Set<Factory> = new Set();

  const factoryElements = $('tr[user]');

  for (let i = 0; i < factoryElements.length; i++) {
    const factoryElement = factoryElements.eq(i);
    const factoryId = parseInt(factoryElement.attr('user')!);
    const factory = await user.models.getFactory(factoryId);
    const factoryTds = factoryElement.find('td[rat]');
    factory.level = parseInt(factoryTds.eq(0).attr('rat')!);
    factory.type = resource;
    if (location instanceof Region) factory.setRegion(location);
    factory.setWage(factoryTds.eq(2).text());
    const ownerId = parseInt(factoryTds.eq(3).attr('rat')!);
    factory.owner = await user.models.getPlayer(ownerId);
    factories.add(factory);
  }

  return [...factories];
}
