"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workStateDept = workStateDept;
const deptIds = {
    buildings: 'w1',
    gold: 'w2',
    oil: 'w3',
    ore: 'w4',
    diamonds: 'w5',
    uranium: 'w6',
    liquidOxygen: 'w7',
    helium3: 'w8',
    tanks: 'w9',
    spaceStations: 'w10',
    battleships: 'w11',
};
async function workStateDept(user, dept = 'tanks') {
    const toBeWorked = Object.entries(deptIds).reduce((acc, [key, value]) => ({ ...acc, [value]: dept == key ? 10 : 0 }), { state: user.player.region.state.id });
    const what = JSON.stringify(toBeWorked);
    return await user.ajax('/rival/instwork', { what });
}
