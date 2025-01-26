import * as cheerio from 'cheerio';
import invariant from 'tiny-invariant';
import { dotless } from '../../misc';
import UserService from '../../user/UserService';
export async function getFactoryInfo(factoryId, force) {
    const user = UserService.getInstance().getUser();
    invariant(user, 'Failed to get user');
    const factory = await user.models.getFactory(factoryId);
    if (!force &&
        factory.lastUpdate &&
        Date.now() - factory.lastUpdate.getTime() < 3 * 1000) {
        return factory;
    }
    const content = await user.get('/factory/index/' + factoryId);
    if (!content || content.length < 150)
        return null;
    const $ = cheerio.load(content);
    factory.name = $('body > div.margin > h1')
        .contents()
        .filter(function () {
        return this.type === 'text';
    })
        .first()
        .text()
        .trim();
    factory.type = $('div.float_left > div.change_paper_about_target.float_left > span')
        .text()
        .split(' ')[0];
    factory.level = dotless($('div.float_left > div.change_paper_about_target.float_left > span').text());
    factory.owner = await user.models.getPlayer($('span[action*="profile"]').attr('action').split('/').pop());
    factory.owner.setName($('span[action*="profile"]').text().trim());
    const region = await user.models.getRegion($('span[action*="map"]').attr('action').split('/').pop());
    factory.setRegion(region);
    factory.region.name = $('span[action*="map"]').text().trim();
    factory.setWage($('h2.white.imp').first().text());
    const potentialWage = dotless($('h2[class$="imp"]').last().text().split(' ')[0]);
    if (potentialWage) {
        factory.potentialWage = potentialWage;
    }
    return factory;
}
