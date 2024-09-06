"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resourceRefill = resourceRefill;
const _1 = require(".");
const amIMinister_1 = require("../../getInfo/misc/amIMinister");
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
async function resourceRefill(user, resource = 'gold') {
    try {
        const ministerInfo = await (0, amIMinister_1.amIMinister)(user);
        (0, tiny_invariant_1.default)(ministerInfo, 'Failed to get minister info');
        (0, tiny_invariant_1.default)(ministerInfo.econ, 'Not the Econ Minister');
        (0, tiny_invariant_1.default)(ministerInfo.econ || !(ministerInfo.leader && ministerInfo.dicta), 'Not the Dictator');
        await user.ajax(`/parliament/donew/42/${_1.resourceIds[resource]}/0`);
        const result = await (0, _1.proLawByText)(user, 'Resources exploration');
        return result;
    }
    catch (e) {
        console.error(e);
    }
}
