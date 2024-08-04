"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parliament = exports.Law = void 0;
class Law {
    id = 0;
    by = null;
    text = '';
    proposedAt = null;
    pro = new Set();
    contra = new Set();
}
exports.Law = Law;
class Parliament {
    capitalRegion = null;
    isAutonomy = false;
    laws = [];
}
exports.Parliament = Parliament;
