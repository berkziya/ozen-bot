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
    toJSON() {
        return {
            id: this.id,
            by: this.by.id,
            text: this.text,
            proposeDate: this.proposeDate,
            pro: Array.from(this.pro, (x) => x.id),
            contra: Array.from(this.contra, (x) => x.id),
        };
    }
}
exports.Law = Law;
class Parliament {
    capitalRegion;
    isAutonomy;
    laws = [];
    toJSON() {
        return {
            capitalRegion: this.capitalRegion.id,
            isAutonomy: this.isAutonomy,
            laws: this.laws,
        };
    }
}
exports.Parliament = Parliament;
