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
const Parliament_1 = require("../../../entity/shared/Parliament");
async function getParliamentInfo(user, capitalId, isAutonomy = false) {
    const url = isAutonomy
        ? '/parliament/auto/' + capitalId
        : '/parliament/index/' + capitalId;
    const content = await fetch(user.link + url, {
        headers: {
            cookie: user.cookies,
        },
    }).then((res) => res.text());
    if (!content || content.length < 150)
        return null;
    const parliament = new Parliament_1.Parliament();
    parliament.isAutonomy = isAutonomy;
    parliament.capitalRegion = await user.models.getRegion(capitalId);
    const $ = cheerio.load(content);
    for (const el of $('div.parliament_law')) {
        const action = $(el).attr('action').split('/');
        const [lawId, byId] = action.reverse();
        const text = $(el).find('div.parliament_sh1').text().trim();
        const law = new Parliament_1.Law();
        law.id = parseInt(lawId);
        law.by = await user.models.getPlayer(byId);
        law.text = text;
        parliament.laws.push(law);
    }
    return parliament;
}
