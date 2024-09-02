import { UserContext } from '../../../UserContext';
import * as cheerio from 'cheerio';

export async function getCitizenList(user: UserContext, id: number) {
  return getPlayerList(user, user.link + `/listed/region/${id}/0/`);
}

export async function getResidentList(user: UserContext, id: number) {
  return getPlayerList(user, user.link + `/listed/residency/${id}/0/`);
}

export async function getStateCitizens(user: UserContext, id: number) {
  return getPlayerList(user, user.link + `/listed/state_population/${id}/`);
}

export async function getStateResidents(user: UserContext, id: number) {
  return getPlayerList(user, user.link + `/listed/residency_state/${id}/0/`);
}

export async function getWarDamageList(
  user: UserContext,
  id: number,
  aggressor: boolean
) {
  return getPlayerList(
    user,
    user.link + `/war/damage/${id}/${aggressor ? 0 : 1}/`
  );
}

async function getPlayerList(user: UserContext, link: string) {
  const players = [];
  while (true) {
    const content = await user.get(link + players.length);

    const $ = cheerio.load(content);

    const playerTrs = $('tr[user]');

    if (playerTrs.length === 0) break;

    for (let i = 0; i < playerTrs.length; i++) {
      const playerTr = playerTrs.eq(i);
      const player = {
        id: parseInt(playerTr.attr('user')!),
        name: playerTr.find('.list_name').first().text().trim(),
        // accountCreation: new Date(playerTr.find('.list_name').last().attr('rat')!),
        level: parseInt(playerTr.find('.list_level').first().attr('rat')!),
        damage: parseInt(playerTr.find('.list_level').last().attr('rat')!),
      };
      players.push(player);
    }
  }
  return players;
}
