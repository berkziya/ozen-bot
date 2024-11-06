import * as cheerio from 'cheerio';
import invariant from 'tiny-invariant';
import { Factory, factoryIds } from '../../../entity/Factory';
import { Region } from '../../../entity/Region';
import { State } from '../../../entity/State';
import { UserHandler } from '../../../UserHandler';
import { getFactoryInfo } from '../getFactoryInfo';
import { fchmod } from 'fs';

export async function getFactoryList(
  location: State | Region,
  resource: keyof typeof factoryIds = 'gold'
) {
  const user = UserHandler.getInstance().getUser();
  invariant(user, 'Failed to get user');

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
    if (factoryTds.eq(2).attr('class')!.includes('ore')) factory.setWage('0');
    const ownerId = parseInt(factoryTds.eq(3).attr('rat')!);
    factory.owner = await user.models.getPlayer(ownerId);
    factories.add(factory);
  }

  return [...factories];
}

export async function getBestFactory(
  location: State | Region,
  resource: keyof typeof factoryIds = 'gold'
) {
  let factories = await getFactoryList(location, resource);
  if (!factories) return null;
  // return [...factories].sort((a, b) => b.wage - a.wage)[0];
  if (resource === 'gold') {
    const best = factories.filter(factory => !factory.isFixed).sort((a, b) => b.wage - a.wage)[0];
    await getFactoryInfo(best.id);
    const coef = (best.potentialWage / best.production);
    factories = factories.map(factory => {
      if (factory.isFixed) return factory;
      factory.potentialWage = factory.production * coef;
      return factory;
    });
    return factories.sort((a, b) => b.potentialWage - a.potentialWage)[0];
  }
  factories = factories.filter(factory => !factory.isFixed);
  return factories.sort((a, b) => b.wage - a.wage)[0];
}
