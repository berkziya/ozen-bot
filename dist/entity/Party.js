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
        this.secretaries = new Set();
        this.members = new Set();
    }
    setRegion(region) {
        this.region = region;
        region.parties.add(this);
    }
    setLeader(player) {
        this.leader = player;
    }
    addSecretary(player) {
        this.secretaries.add(player);
    }
    addMember(player) {
        if (player.party) {
            player.party.members.delete(player);
        }
        this.members.add(player);
        player.party = this;
    }
    removeMember(player) {
        if (player.party === this) {
            player.party = null;
        }
        this.members.delete(player);
    }
    toJSON() {
        return {
            lastUpdate: this.lastUpdate,
            id: this.id,
            name: this.name,
            region: this.region,
            leader: this.leader,
            secretaries: Array.from(this.secretaries, (secretary) => secretary.id),
            members: Array.from(this.members, (member) => member.id),
        };
    }
}
exports.Party = Party;
