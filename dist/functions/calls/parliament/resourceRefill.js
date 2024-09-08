"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resourceRefill = resourceRefill;
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const _1 = require(".");
const amIMinister_1 = require("../../getInfo/misc/amIMinister");
async function resourceRefill(user, resource = 'gold') {
    const ministerInfo = await (0, amIMinister_1.amIMinister)(user.id);
    (0, tiny_invariant_1.default)(ministerInfo, 'Failed to get minister info');
    if (!ministerInfo.econ && !(ministerInfo.leader && ministerInfo.dicta))
        return null;
    await user.ajax(`/parliament/donew/42/${_1.resourceIds[resource]}/0`);
    const result = await (0, _1.proLawByText)(user, 'Resources exploration');
    return result;
}
