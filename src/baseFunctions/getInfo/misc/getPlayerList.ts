import { Region } from '../../../entity/Region';
import { State } from '../../../entity/State';
import { UserContext } from '../../../UserContext';
import * as cheerio from 'cheerio';

export async function getCitizens(user: UserContext, location: Region | State) {
  return location instanceof State
    ? getStateCitizens(user, location.id)
    : getCitizenList(user, location.id);
}

export async function getResidents(
  user: UserContext,
  location: Region | State
) {
  return location instanceof State
    ? getStateResidents(user, location.id)
    : getResidentList(user, location.id);
}

async function getCitizenList(user: UserContext, id: number) {
  return getPlayerList(user, user.link + `/listed/region/${id}/0/`);
}

async function getResidentList(user: UserContext, id: number) {
  return getPlayerList(user, user.link + `/listed/residency/${id}/0/`);
}

async function getStateCitizens(user: UserContext, id: number) {
  return getPlayerList(user, user.link + `/listed/state_population/${id}/`);
}

async function getStateResidents(user: UserContext, id: number) {
  return getPlayerList(user, user.link + `/listed/residency_state/${id}/0/`);
}

export async function getWarDamageList(
  user: UserContext,
  id: number,
  defender: boolean
) {
  return getPlayerList(
    user,
    user.link + `/war/damage/${id}/${defender ? 1 : 0}/`
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
