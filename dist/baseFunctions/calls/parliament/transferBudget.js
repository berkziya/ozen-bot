"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferBudget = transferBudget;
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const Autonomy_1 = require("../../../entity/Autonomy");
const Region_1 = require("../../../entity/Region");
const State_1 = require("../../../entity/State");
const getAutonomyInfo_1 = require("../../getInfo/getAutonomyInfo");
const getStateInfo_1 = require("../../getInfo/getStateInfo");
const amIMinister_1 = require("../../getInfo/misc/amIMinister");
const _1 = require(".");
const resourceIds = {
    money: 1,
    gold: 0,
    oil: 3,
    ore: 4,
    uranium: 11,
    diamonds: 15,
};
async function transferBudget(user, to, resource, amount) {
    try {
        const ministerInfo = await (0, amIMinister_1.amIMinister)(user);
        (0, tiny_invariant_1.default)(ministerInfo, 'Failed to get minister info');
        if (!ministerInfo.econ || (!ministerInfo.leader && ministerInfo.dicta)) {
            return "You don't have permission to transfer budget";
        }
        let capitalId = 0;
        if (to instanceof State_1.State) {
            if (!(0, getStateInfo_1.getStateInfo)(user, to.id, true)) {
                return 'Failed to get state info';
            }
            capitalId = to.capital.id;
        }
        else if (to instanceof Autonomy_1.Autonomy) {
            if (!(0, getAutonomyInfo_1.getAutonomyInfo)(user, to.id)) {
                return 'Failed to get autonomy info';
            }
            capitalId = to.capital.id;
        }
        else if (to instanceof Region_1.Region) {
            capitalId = to.id;
        }
        (0, tiny_invariant_1.default)(capitalId, 'Failed to get id');
        console.log(`Transfering ${amount} ${resource} to ${to}`);
        await user.ajax(`/parliament/donew/send_${resourceIds[resource]}/${amount}/${capitalId}`, { tmp_gov: amount });
        const result = await (0, _1.proLawByText)(user, 'Budget transfer');
        return result;
    }
    catch (e) {
        console.error(e);
        return null;
    }
}
