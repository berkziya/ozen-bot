"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWarInfo = exports.getStateInfo = exports.getRegionInfo = exports.getPlayerInfo = exports.getFactoryInfo = exports.getAutonomyInfo = void 0;
var getAutonomyInfo_1 = require("./getAutonomyInfo");
Object.defineProperty(exports, "getAutonomyInfo", { enumerable: true, get: function () { return getAutonomyInfo_1.getAutonomyInfo; } });
// export { getBlocInfo } from './getBlocInfo';
var getFactoryInfo_1 = require("./getFactoryInfo");
Object.defineProperty(exports, "getFactoryInfo", { enumerable: true, get: function () { return getFactoryInfo_1.getFactoryInfo; } });
// export { getPartyInfo } from './getPartyInfo';
var getPlayerInfo_1 = require("./getPlayerInfo");
Object.defineProperty(exports, "getPlayerInfo", { enumerable: true, get: function () { return getPlayerInfo_1.getPlayerInfo; } });
var getRegionInfo_1 = require("./getRegionInfo");
Object.defineProperty(exports, "getRegionInfo", { enumerable: true, get: function () { return getRegionInfo_1.getRegionInfo; } });
var getStateInfo_1 = require("./getStateInfo");
Object.defineProperty(exports, "getStateInfo", { enumerable: true, get: function () { return getStateInfo_1.getStateInfo; } });
var getWarInfo_1 = require("./getWarInfo");
Object.defineProperty(exports, "getWarInfo", { enumerable: true, get: function () { return getWarInfo_1.getWarInfo; } });
