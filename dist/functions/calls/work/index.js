import { factoryIds } from '../../../entity/Factory';
export async function assignToFactory(user, factory) {
    return await user.ajax('/factory/assign', { factory: factory.id });
}
export async function cancelAutoWork(user) {
    return await user.ajax('/work/autoset_cancel');
}
export async function autoWork(user, factory) {
    await assignToFactory(user, factory);
    return await user.ajax('/work/autoset', {
        mentor: 0,
        factory: factory.id,
        type: factoryIds[factory.type],
        lim: 0,
    });
}
