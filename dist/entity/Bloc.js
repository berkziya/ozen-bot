"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bloc = void 0;
class Bloc {
    lastUpdate = new Date(0);
    id;
    name;
    states;
    militaryAgreement = false;
    openBorders = false;
    constructor(id_) {
        this.id = id_;
        this.name = 'bloc/' + this.id.toString();
        this.states = new Set();
    }
    addState(state) {
        this.states.add(state);
        state.bloc = this;
    }
}
exports.Bloc = Bloc;
