"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignToFactory = assignToFactory;
exports.cancelAutoWork = cancelAutoWork;
exports.autoWork = autoWork;
const Factory_1 = require("../../../entity/Factory");
async function assignToFactory(user, factory) {
    return await user.ajax('/factory/assign', { factory: factory.id });
}
async function cancelAutoWork(user) {
    return await user.ajax('/work/autoset_cancel');
}
async function autoWork(user, factory) {
    return await user.ajax('/work/autoset', {
        mentor: 0,
        factory: factory.id,
        type: Factory_1.factoryIds[factory.type],
        lim: 0,
    });
}
