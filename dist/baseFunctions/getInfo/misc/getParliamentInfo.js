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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParliamentInfo = getParliamentInfo;
const cheerio = __importStar(require("cheerio"));
async function getParliamentInfo(user, capitalId, isAutonomy = false) {
    const url = isAutonomy
        ? 'parliament/auto/' + capitalId
        : 'parliament/index/' + capitalId;
    const { content } = await user.get(url);
    if (!content) {
        return null;
    }
    const $ = cheerio.load(content);
    const laws = [];
    $('div.parliament_law').each((i, el) => {
        const action = $(el).attr('action').split('/');
        const lawId = parseInt(action[action.length - 1]);
        const by = parseInt(action[action.length - 2]);
        const text = $(el).find('div > span').text().trim();
        laws.push({ capitalId, lawId, by, text });
    });
    return laws;
}
