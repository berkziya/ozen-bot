import { UserContext } from '../../../Client';

declare let id: number;

export async function internetIsOn(user: UserContext) {
  return await user.page.evaluate(() => {
    return new Promise((resolve) => {
      if (navigator.onLine) {
        resolve(true);
      } else {
        window.addEventListener('online', () => resolve(true));
      }
    });
  });
}

export default async function imAlive(user: UserContext) {
  return await user.lock.acquire(['page', 'context'], async () => {
    try {
      if (!internetIsOn(user)) {
        throw new Error('No internet connection');
      }
      return await user.page.evaluate(() => {
        return id;
      });
    } catch (e) {
      console.error(e);
      return null;
    }
  });
}
