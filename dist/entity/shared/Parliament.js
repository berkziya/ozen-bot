"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parliament = exports.Law = void 0;
class Law {
    id;
    by;
    text;
    proposeDate = null;
    pro = new Set();
    contra = new Set();
}
exports.Law = Law;
class Parliament {
    capitalRegion;
    isAutonomy;
    laws = [];
}
exports.Parliament = Parliament;
