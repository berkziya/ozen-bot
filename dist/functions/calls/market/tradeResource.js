"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyResource = buyResource;
exports.sellResource = sellResource;
exports.getMyOffer = getMyOffer;
const cheerio = __importStar(require("cheerio"));
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const _1 = require(".");
const parseMarketData_1 = require("../../getInfo/misc/parseMarketData");
async function buyResource(user, resource, amount) {
    const offers = await (0, parseMarketData_1.parseMarketData)(user, resource);
    (0, tiny_invariant_1.default)(offers);
    const offer = offers[0];
    return await user.ajax(`/storage/buy/${_1.resourceToId[resource]}/${offer.userId}/${amount}/${offer.price}`);
}
async function sellResource(user, resource, amount, price) {
    return await user.ajax(`/storage/newsell/${_1.resourceToId[resource]}/${amount}/${price}`);
}
async function getMyOffer(user, resource) {
    const response = await user.ajax(`/storage/sell/${_1.resourceToId[resource]}`);
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
