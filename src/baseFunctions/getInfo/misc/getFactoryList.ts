import { Factory, resourceToId } from '../../../entity/Factory';
import { Region } from '../../../entity/Region';
import { UserContext } from '../../../UserContext';
import * as cheerio from 'cheerio';

export async function getFactoryList(
  user: UserContext,
  locationId: number,
  isState: boolean = false,
  resource: keyof typeof resourceToId = 'gold'
) {
  const resourceId = resourceToId[resource];

  const link = isState
    ? `/factory/state/${locationId}/0/${resourceId}/`
    : `/factory/search/${locationId}/0/${resourceId}/`;

  const content = await fetch(user.link + link, {
    headers: { cookie: user.cookies },
  }).then((res) => res.text());

  if (!content || content.length < 150) return null;

  const $ = cheerio.load(content);

  const location = isState
    ? await user.models.getState(locationId)
    : await user.models.getRegion(locationId);

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
    factory.setWage(factoryTds.eq(2).attr('rat')!);
    const ownerId = parseInt(factoryTds.eq(3).attr('rat')!);
    factory.owner = await user.models.getPlayer(ownerId);
    factories.add(factory);
  }

  return factories;
}
