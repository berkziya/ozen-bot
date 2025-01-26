import * as cheerio from 'cheerio';
import invariant from 'tiny-invariant';
import { State } from '../../../entity/State';
import UserService from '../../../user/UserService';
export async function getCitizens(location) {
    const user = UserService.getInstance().getUser();
    invariant(user, 'Failed to get user');
    return location instanceof State
        ? getStateCitizens(user, location.id)
        : getCitizenList(user, location.id);
}
export async function getResidents(user, location) {
    return location instanceof State
        ? getStateResidents(user, location.id)
        : getResidentList(user, location.id);
}
async function getCitizenList(user, id) {
    return getPlayerList(user, user.link + `/listed/region/${id}/0/`);
}
async function getResidentList(user, id) {
    return getPlayerList(user, user.link + `/listed/residency/${id}/0/`);
}
async function getStateCitizens(user, id) {
    return getPlayerList(user, user.link + `/listed/state_population/${id}/`);
}
async function getStateResidents(user, id) {
    return getPlayerList(user, user.link + `/listed/residency_state/${id}/0/`);
}
export async function getWarDamageList(user, id, defender) {
    return getPlayerList(user, user.link + `/war/damage/${id}/${defender ? 1 : 0}/`);
}
async function getPlayerList(user, link) {
    const players = [];
    while (true) {
        const content = await user.get(link + players.length);
        const $ = cheerio.load(content);
        const playerTrs = $('tr[user]');
        if (playerTrs.length === 0)
            break;
        for (let i = 0; i < playerTrs.length; i++) {
            const playerTr = playerTrs.eq(i);
            const player = {
                id: parseInt(playerTr.attr('user')),
                name: playerTr.find('.list_name').first().text().trim(),
                // accountCreation: new Date(playerTr.find('.list_name').last().attr('rat')!),
                level: parseInt(playerTr.find('.list_level').first().attr('rat')),
                damage: parseInt(playerTr.find('.list_level').last().attr('rat')),
            };
            players.push(player);
        }
    }
    return players;
}
