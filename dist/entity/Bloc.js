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
    toJSON() {
        return {
            lastUpdate: this.lastUpdate,
            id: this.id,
            name: this.name,
            states: Array.from(this.states).map((state) => state.id),
            militaryAgreement: this.militaryAgreement,
            openBorders: this.openBorders,
        };
    }
    static [Symbol.hasInstance](instance) {
        return (instance &&
            typeof instance === 'object' &&
            'militaryAgreement' in instance);
    }
}
exports.Bloc = Bloc;
