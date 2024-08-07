"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRegionsTable = parseRegionsTable;
const utils_1 = require("../../../misc/utils");
async function parseRegionsTable(user, stateId = null) {
    let url = '/info/regions/';
    const page = await user.context.newPage();
    let state = null;
    if (stateId) {
        state = await user.models.getState(stateId);
        url += stateId;
        state.regions = new Set();
    }
    try {
        await page.goto(url);
        await page.waitForLoadState('load');
        const selector = 'body > table';
        const data = await page.$$eval(selector, (rows, toCamelCaseFn) => {
            const headerRow = rows.shift();
            const headers = Array.from(headerRow.querySelectorAll('th'), (cell) => toCamelCaseFn(cell.textContent?.trim() || ''));
            return rows.map((row) => {
                const cells = row.querySelectorAll('td');
                const rowData = Array.from(cells, (cell) => cell.textContent?.trim() || '');
                const rowObject = {};
                headers.forEach(async (header, index) => {
                    if (index === 0) {
                        const [name, id] = rowData[index].split(', id: ');
                        rowObject.name = name;
                        rowObject.id = id;
                        if (state) {
                            const region = await user.models.getRegion(id);
                            region.name = name;
                            region.setState(state);
                        }
                    }
                    else {
                        rowObject[header] = rowData[index];
                    }
                });
                return rowObject;
            });
        }, utils_1.toCamelCase);
        return data;
    }
    finally {
        await page.close();
    }
}
