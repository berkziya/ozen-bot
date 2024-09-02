import { dotless } from '../../../misc/utils';
import { UserContext } from '../../../UserContext';
import * as cheerio from 'cheerio';

export async function storageInfo(user: UserContext) {
  const content = await user.get('/storage');

  if (!content || content.length < 150) return null;

  const $ = cheerio.load(content);

  function extractStorageInfo(id: number) {
    return dotless($(`span[urlbar="${id}"]`).text().trim());
  }

  user.player.storage.oil = extractStorageInfo(3);
  user.player.storage.ore = extractStorageInfo(4);
  user.player.storage.uranium = extractStorageInfo(11);
  user.player.storage.diamonds = extractStorageInfo(15);
  user.player.storage.liquidOxygen = extractStorageInfo(21);
  user.player.storage.helium3 = extractStorageInfo(24);
  user.player.storage.rivalium = extractStorageInfo(26);
  user.player.storage.antirad = extractStorageInfo(13);
  user.player.storage.energyDrink = extractStorageInfo(17);
  user.player.storage.spaceRockets = extractStorageInfo(20);
  user.player.storage.lss = extractStorageInfo(25);
  user.player.storage.tanks = extractStorageInfo(2);
  user.player.storage.aircrafts = extractStorageInfo(1);
  user.player.storage.missiles = extractStorageInfo(14);
  user.player.storage.bombers = extractStorageInfo(16);
  user.player.storage.battleships = extractStorageInfo(18);
  user.player.storage.laserDrones = extractStorageInfo(27);
  user.player.storage.moonTanks = extractStorageInfo(22);
  user.player.storage.spaceStations = extractStorageInfo(23);
  // user.player.storage.submarines = extractStorageInfo(19);

  $('script').each((_i, el) => {
    const script = $(el).html();

    if (!script) return;

    const money = script.match(/new_m\('([0-9.]+)'\);/);
    if (money) user.player.storage.money = dotless(money[1]);

    const gold = script.match(/new_g\('([0-9.]+)'\);/);
    if (gold) user.player.storage.gold = dotless(gold[1]);

    const expNlvl = script.match(/exp_size\((\d+), (\d+)/);
    if (expNlvl) {
      user.player.exp = parseInt(expNlvl[1]);
      user.player.level = parseInt(expNlvl[2]);
    }
  });

  return user.player.storage;
}
