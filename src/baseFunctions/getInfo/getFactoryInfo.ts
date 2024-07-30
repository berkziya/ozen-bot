// import { UserContext } from '../../Client';
// import * as cheerio from 'cheerio';
// import { dotless } from '../../misc/utils';

// export async function getFactoryInfo(
//   user: UserContext,
//   factoryId: number,
//   force?: boolean
// ) {
//   const factory = await user.models.getFactory(factoryId);

//   if (
//     !force &&
//     factory.lastUpdate &&
//     Date.now() - factory.lastUpdate < 60 * 30
//   ) {
//     return factory;
//   }

//   const url = '/factory/index/' + factoryId;
//   const [content, img] = await user.get(url);

//   if (!content || content.length < 100) {
//     return null;
//   }

//   factory.image = img;

//   const $ = cheerio.load(content);

//   try {
//     factory.name = $('body > div.margin > h1')
//       .contents()
//       .filter(function () {
//         return this.type === 'text';
//       })
//       .first()
//       .text()
//       .trim();

//     factory.setType(
//       $('div.float_left > div.change_paper_about_target.float_left > span')
//         .text()
//         .split(' ')[0]
//     );
//     factory.level = dotless(
//       $(
//         'div.float_left > div.change_paper_about_target.float_left > span'
//       ).text()
//     );
//     factory.owner = await user.models.getPlayer(
//       $('span[action*="profile"]').attr('action')!.split('/').pop()!
//     );
//     factory.owner.setName($('span[action*="profile"]').text().trim());
//     factory.location = await user.models.getRegion(
//       $('span[action*="map"]').attr('action')!.split('/').pop()!
//     );
//     factory.location.name = $('span[action*="map"]').text().trim();
//     factory.setWage($('h2[class$="imp"]').first().text());

//     const potentialWage = dotless(
//       $('h2[class$="imp"]').last().text().split(' ')[0]
//     );
//     if (potentialWage) {
//       factory.potentialWage = potentialWage;
//     }
//   } catch (e) {
//     console.error(e);
//   }
//   return factory;
// }
