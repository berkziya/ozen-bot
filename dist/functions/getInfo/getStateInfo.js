import * as cheerio from 'cheerio';
import invariant from 'tiny-invariant';
import { dotless, toCamelCase } from '../../misc';
import UserService from '../../user/UserService';
export async function getStateInfo(stateId, force) {
    const user = UserService.getInstance().getUser();
    invariant(user, 'Failed to get user');
    const state = await user.models.getState(stateId);
    if (!force &&
        state.lastUpdate &&
        Date.now() - state.lastUpdate.getTime() < 3 * 1000) {
        return state;
    }
    const content = await user.get('/map/state_details/' + stateId);
    if (!content || content.length < 150)
        return null;
    const $ = cheerio.load(content);
    state.name = $('body > div.margin > h1 > a').text().trim();
    const budgetDiv = $('div.slide_profile_photo > div.imp');
    state.storage.setBudgetFromDiv(budgetDiv);
    async function playerFromDiv(div) {
        const playerDiv = div.find('div[action*="profile"]');
        const player = await user.models.getPlayer(playerDiv.attr('action').split('/').pop());
        const playerName = playerDiv.text().match(/([^]*)Wage:/);
        player.setName(playerName ? playerName[1] : player.name);
        return player;
    }
    const divs = $('#region_scroll > div');
    for (let i = 0; i < divs.length; i++) {
        const div = divs.eq(i);
        const key = toCamelCase(div.find('h2').first().text());
        if (key === 'entryFee') {
            const fee = dotless(div.find('div.slide_profile_data > h2').first().text());
            state.entryFee = fee;
        }
        else if (key === 'borders') {
            if (div.text().toLowerCase().includes('opened')) {
                state.bordersOpen = true;
            }
            else {
                state.bordersOpen = false;
            }
        }
        else if (key === 'residencyForWork') {
            if (div.text().toLowerCase().includes('not')) {
                state.needResidencyToWork = false;
            }
            else {
                state.needResidencyToWork = true;
            }
        }
        else if (key === 'residency') {
            if (div.text().toLowerCase().includes('leader')) {
                state.residencyIssuedByLeader = true;
            }
            else {
                state.residencyIssuedByLeader = false;
            }
        }
        else if (key === 'governmentForm') {
            state.governmentForm = toCamelCase(div.find('span').first().text());
            // } else if (key === 'geopoliticalBloc') {
            //   const blocDiv = div.find('div[action^="blocs/show/"]');
            //   state.bloc = user.models.getBloc(blocDiv.attr('action')!.split('/').pop()!);
        }
        else if (key === 'stateLeader') {
            const leader = await playerFromDiv(div);
            state.setLeader(leader);
        }
        else if (key === 'leaderAndCommander' ||
            key === 'dictator' ||
            key === 'monarch') {
            const leader = await playerFromDiv(div);
            state.setLeader(leader);
            state.leaderIsCommander = true;
        }
        else if (key === 'economicAdviser' || key === 'ministerOfEconomics') {
            const econ = await playerFromDiv(div);
            state.setEconMinister(econ);
        }
        else if (key === 'foreignMinister') {
            const foreign = await playerFromDiv(div);
            state.setForeignMinister(foreign);
        }
        else if (key === 'stateRegions') {
            const regions = div.find('div[action^="map/details/"]').toArray();
            for (const [i, el] of regions.entries()) {
                const region = await user.models.getRegion($(el).attr('action').split('/').pop());
                region.name = $(el).text().trim();
                state.addRegion(region);
                if (i === 0) {
                    state.setCapital(region);
                }
            }
        }
    }
    state.lastUpdate = new Date();
    return state;
}
