import { dotless } from '../../../misc/utils';
import { UserContext } from '../../../UserContext';
import * as cheerio from 'cheerio';

export async function storageInfo(user: UserContext) {
  const content = await user.get('/storage');

  if (!content || content.length < 150) return null;

  const $ = cheerio.load(content);

  function collectInfo(id: number) {
    return dotless($(`span[urlbar="${id}"]`).text().trim());
  }

  user.player.storage.oil = collectInfo(3);
  user.player.storage.ore = collectInfo(4);
  user.player.storage.uranium = collectInfo(11);
  user.player.storage.diamonds = collectInfo(15);
  user.player.storage.liquidOxygen = collectInfo(21);
  user.player.storage.helium3 = collectInfo(24);
  user.player.storage.rivalium = collectInfo(26);
  user.player.storage.antirad = collectInfo(13);
  user.player.storage.energyDrink = collectInfo(17);
  user.player.storage.spaceRockets = collectInfo(20);
  user.player.storage.lss = collectInfo(25);
  user.player.storage.tanks = collectInfo(2);
  user.player.storage.aircrafts = collectInfo(1);
  user.player.storage.missiles = collectInfo(14);
  user.player.storage.bombers = collectInfo(16);
  user.player.storage.battleships = collectInfo(18);
  user.player.storage.laserDrones = collectInfo(27);
  user.player.storage.moonTanks = collectInfo(22);
  user.player.storage.spaceStations = collectInfo(23);
  // user.player.storage.submarines = collectInfo(19);

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
