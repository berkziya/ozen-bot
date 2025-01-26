// import { UserContext } from '../../../user/UserContext';
// import { State } from '../../../entity/State';

// export async function parseRegionsTable(
//   user: UserContext,
//   stateId: number | null = null
// ) {
//   let url = '/info/regions/';
//   const page = await user.context.newPage();
//   let state: State | null = null;

//   if (stateId) {
//     state = await user.models.getState(stateId);
//     url += stateId;
//     state.regions = new Set();
//   }

//   try {
//     await page.goto(url);
//     await page.waitForLoadState('load');

//     const selector = 'body > table';
//     const data = await page.$$eval(selector, (rows: Element[]) => {
//       const headerRow = rows.shift();
//       const headers = Array.from(headerRow!.querySelectorAll('th'), (cell) =>
//         toCamelCase(cell.textContent?.trim() || '')
//       );
//       return rows.map((row: Element) => {
//         const cells = row.querySelectorAll('td');
//         const rowData = Array.from(
//           cells,
//           (cell) => cell.textContent?.trim() || ''
//         );
//         const rowObject: { [key: string]: string } = {};
//         headers.forEach(async (header, index) => {
//           if (index === 0) {
//             const [name, id] = rowData[index].split(', id: ');
//             rowObject.name = name;
//             rowObject.id = id;
//             if (state) {
//               const region = await user.models.getRegion(id);
//               region.name = name;
//               region.setState(state);
//             }
//           } else {
//             rowObject[header] = rowData[index];
//           }
//         });
//         return rowObject;
//       });
//     });
//     return data;
//   } finally {
//     await page.close();
//   }
// }
