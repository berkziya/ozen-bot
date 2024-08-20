"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proLaw = proLaw;
exports.cancelSelfLaw = cancelSelfLaw;
async function proLaw(user, capitalId, law) {
    return await user.ajax(`/parliament/votelaw/${capitalId}/${law.by?.id}/${law.id}/pro`);
}
async function cancelSelfLaw(user) {
    return await user.ajax('/parliament/removelaw');
}
