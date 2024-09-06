import { Factory } from '../../../entity/Factory';
import { User } from '../../../User';
import { factoryIds } from '../../../entity/Factory';

export async function assignToFactory(user: User, factory: Factory) {
  return await user.ajax('/factory/assign', { factory: factory.id });
}

export async function cancelAutoWork(user: User) {
  return await user.ajax('/work/autoset_cancel');
}

export async function autoWork(user: User, factory: Factory) {
  return await user.ajax('/work/autoset', {
    mentor: 0,
    factory: factory.id,
    type: factoryIds[factory.type as keyof typeof factoryIds],
    lim: 0,
  });
}
