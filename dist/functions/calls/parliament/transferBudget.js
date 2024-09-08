"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferBudget = transferBudget;
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const _1 = require(".");
const Autonomy_1 = require("../../../entity/Autonomy");
const Region_1 = require("../../../entity/Region");
const State_1 = require("../../../entity/State");
const getAutonomyInfo_1 = require("../../getInfo/getAutonomyInfo");
const getStateInfo_1 = require("../../getInfo/getStateInfo");
const amIMinister_1 = require("../../getInfo/misc/amIMinister");
async function transferBudget(user, target, resource, amount) {
    const ministerInfo = await (0, amIMinister_1.amIMinister)(user.id);
    (0, tiny_invariant_1.default)(ministerInfo, 'Failed to get minister info');
    if (!ministerInfo.econ || !(ministerInfo.leader && ministerInfo.dicta))
        return null;
    let targetCapitalId = 0;
    if (target instanceof State_1.State) {
        if (!(0, getStateInfo_1.getStateInfo)(target.id)) {
            return 'Failed to get state info';
        }
        targetCapitalId = target.capital.id;
    }
    else if (target instanceof Autonomy_1.Autonomy) {
        if (!(0, getAutonomyInfo_1.getAutonomyInfo)(target.id)) {
            return 'Failed to get autonomy info';
        }
        targetCapitalId = target.capital.id;
    }
    else if (target instanceof Region_1.Region) {
        targetCapitalId = target.id;
    }
    (0, tiny_invariant_1.default)(targetCapitalId, 'Failed to get the target capital');
    await user.ajax(`/parliament/donew/send_${_1.resourceIds[resource]}/${amount}/${targetCapitalId}`, { tmp_gov: amount });
    const result = await (0, _1.proLawByText)(user, 'Budget transfer');
    return result;
}
