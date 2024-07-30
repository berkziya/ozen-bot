"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Party = void 0;
class Party {
    lastUpdate = 0;
    id;
    name;
    region;
    leader;
    secretaries;
    members;
    constructor(id_) {
        this.id = id_;
        this.name = 'party/' + this.id.toString();
        this.secretaries = [];
        this.members = [];
    }
    toJSON() {
        return {
            lastUpdate: this.lastUpdate,
            id: this.id,
            name: this.name,
            region: this.region,
            leader: this.leader,
            secretaries: this.secretaries,
            members: this.members,
        };
    }
}
exports.Party = Party;
