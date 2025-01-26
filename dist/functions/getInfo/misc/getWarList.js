import * as cheerio from 'cheerio';
import invariant from 'tiny-invariant';
import UserService from '../../../user/UserService';
export async function getWarList(stateId) {
    const user = UserService.getInstance().getUser();
    invariant(user, 'Failed to get user');
    const content = await user.get('/listed/statewars/' + stateId);
    if (!content || content.length < 150)
        return null;
    const $ = cheerio.load(content);
    const wars = new Set();
    async function tdToRegion(td) {
        const regionId = parseInt(td.attr('action').split('/').pop());
        if (!regionId) {
            if (td.text().includes('Coup')) {
                return 'coup';
            }
            return 'revolution';
        }
        const region = await user.models.getRegion(regionId);
        const stateDiv = td.find('div[action^="map/state"]');
        const stateId = parseInt(stateDiv.attr('action').split('/').pop());
        const state = await user.models.getState(stateId);
        const regionName = stateDiv.attr('title');
        const stateName = td.find('span').text().replace(regionName, '').trim();
        region.name = regionName;
        region.setState(state);
        state.name = stateName;
        return region;
    }
    const warTrs = $('tbody > tr');
    for (let i = 0; i < warTrs.length; i++) {
        const warTr = warTrs.eq(i);
        const warId = parseInt(warTr.find('div[url]').attr('url'));
        const war = await user.models.getWar(warId);
        const attackerRegion = await tdToRegion(warTr.find('td[action^="map/details"]').first());
        const defenderRegion = await tdToRegion(warTr.find('td[action^="map/details"]').last());
        const aggressor = attackerRegion;
        if (aggressor === 'coup' || aggressor === 'revolution') {
            war.type = aggressor;
            war.aggressor = await user.models.getRegion(0);
        }
        else
            war.aggressor = aggressor;
        war.defender = defenderRegion;
        // war.diff = parseInt(warTr.find('td[rat][action]').first().attr('rat')!);
        war.endingTime = new Date(parseInt(warTr.find('td[rat]').last().attr('rat')));
        wars.add(war);
    }
    return [...wars];
}
