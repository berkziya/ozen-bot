import * as cheerio from 'cheerio';
import invariant from 'tiny-invariant';
import { toCamelCase } from '../../misc';
import UserService from '../../user/UserService';
import { getRegionInfoInner } from './getRegionInfo';
export async function getAutonomyInfo(autonomyId, force) {
    const user = UserService.getInstance().getUser();
    invariant(user, 'Failed to get user');
    const autonomy = await user.models.getAutonomy(autonomyId);
    if (!force &&
        autonomy.lastUpdate &&
        Date.now() - autonomy.lastUpdate.getTime() < 3 * 1000) {
        return autonomy;
    }
    const content = await user.get('/map/autonomy_details/' + autonomyId);
    if (!content || content.length < 150) {
        return getRegionInfoInner(user, autonomyId, true);
    }
    autonomy.governor = null;
    autonomy.regions = new Set();
    const $ = cheerio.load(content);
    const stateSpan = $('h1 > span[action]');
    const stateId = stateSpan.attr('action').split('/').pop();
    const state = await user.models.getState(stateId);
    state.name = stateSpan.text().trim();
    autonomy.setState(state);
    autonomy.name = $('h1')
        .contents()
        .filter((_i, e) => e.type === 'text')
        .first()
        .text()
        .replace(', ', '')
        .trim();
    const budgetDiv = $('div.slide_profile_photo > div.imp');
    autonomy.storage.setBudgetFromDiv(budgetDiv);
    const divs = $('#region_scroll > div');
    for (let i = 0; i < divs.length; i++) {
        const div = divs.eq(i);
        const key = toCamelCase(div.find('h2').first().text());
        if (key === 'governor') {
            const governorDiv = div.find('div.slide_profile_data > div');
            const governor = await user.models.getPlayer(governorDiv.attr('action').split('/').pop());
            const governorName = governorDiv.text().match(/([^]*)Wage:/);
            governor.setName(governorName ? governorName[1] : governor.name);
            autonomy.setGovernor(governor);
        }
        if (key === 'autonomyRegions') {
            const regions = div.find('div[action^="map/details/"]').toArray();
            await Promise.all(regions.map(async (el, i) => {
                const region = await user.models.getRegion($(el).attr('action').split('/').pop());
                region.name = $(el).text().trim();
                autonomy.addRegion(region);
                if (i === 0) {
                    autonomy.setCapital(region);
                }
            }));
        }
    }
    autonomy.lastUpdate = new Date();
    return autonomy;
}
