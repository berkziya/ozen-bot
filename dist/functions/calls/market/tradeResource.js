import * as cheerio from 'cheerio';
import invariant from 'tiny-invariant';
import { resourceToId } from '.';
import { parseMarketData } from '../../getInfo/misc/parseMarketData';
export async function buyResource(user, resource, amount) {
    const offers = await parseMarketData(resource);
    invariant(offers);
    const offer = offers[0];
    if (!amount)
        amount = offer.amount;
    return await user.ajax(`/storage/buy/${resourceToId[resource]}/${offer.userId}/${amount}/${offer.price}`);
}
export async function sellResource(user, resource, amount, price) {
    return await user.ajax(`/storage/newsell/${resourceToId[resource]}/${amount}/${price}`);
}
export async function getMyOffer(user, resource) {
    const response = await user.ajax(`/storage/sell/${resourceToId[resource]}`);
    const content = await response.text();
    if (!content || content.length < 150)
        return null;
    const $ = cheerio.load(content);
    const myoffer = {
        amount: 0,
        price: 0,
        sellLock: 0,
    };
    try {
        myoffer['amount'] = parseInt($('input[original]').first().attr('original'));
        myoffer['price'] = parseInt($('input[value]').last().attr('value') || '0'); //hence the price
        const sellLock = content.match(/countdown\({until: (\d+)/);
        if (sellLock)
            myoffer['sellLock'] = parseInt(sellLock[1]);
    }
    catch { }
    return myoffer;
}
