"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelMove = cancelMove;
exports.moveTo = moveTo;
exports.buildMilitaryAcademy = buildMilitaryAcademy;
async function cancelMove(user) {
    return await user.ajax('/map/cancel_move');
}
async function moveTo(user, region, fast = false) {
    return await user.ajax(`/map/region_move/${region.id}`, {
        type: fast ? 2 : 1,
        b: 1,
    });
}
async function buildMilitaryAcademy(user) {
    return await user.ajax('/slide/academy_do/');
}
