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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParliamentInfo = getParliamentInfo;
const cheerio = __importStar(require("cheerio"));
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const Parliament_1 = require("../../../entity/shared/Parliament");
const UserHandler_1 = require("../../../UserHandler");
async function getParliamentInfo(capital, isAutonomy = false) {
    const user = UserHandler_1.UserHandler.getInstance().getUser();
    (0, tiny_invariant_1.default)(user, 'Failed to get user');
    const url = isAutonomy
        ? '/parliament/auto/' + capital.id
        : '/parliament/index/' + capital.id;
    const content = await user.get(url);
    if (!content || content.length < 150)
        return null;
    const parliament = new Parliament_1.Parliament();
    parliament.isAutonomy = isAutonomy;
    parliament.capitalRegion = capital;
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
