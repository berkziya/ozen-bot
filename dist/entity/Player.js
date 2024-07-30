"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const Storage_1 = require("./shared/Storage");
class Player {
    lastUpdate = 0;
    id;
    name;
    level = 30;
    exp = 0;
    perks = {
        str: 30,
        edu: 30,
        end: 30,
    };
    region;
    residency;
    homelandBonus;
    leaderOfState;
    econMinisterOfState;
    foreignMinisterOfState;
    governorOfAuto;
    party;
    storage = new Storage_1.Storage();
    statePermits = [];
    regionPermits = [];
    constructor(id_) {
        this.id = id_;
        this.name = 'player/' + this.id.toString();
        this.homelandBonus = null;
        this.leaderOfState = null;
        this.econMinisterOfState = null;
        this.foreignMinisterOfState = null;
        this.governorOfAuto = null;
        this.party = null;
    }
    setName(name) {
        const havePartyTag = name.match(/\[[^\]]{1,3}\]/g);
        if (havePartyTag) {
            this.name = name.replace(havePartyTag[0], '').trim();
        }
        else {
            this.name = name.trim();
        }
    }
    setRegion(region) {
        this.region = region;
        region.citizens.push(this);
    }
    setResidency(region) {
        this.residency = region;
        region.residents.push(this);
    }
    setLeader(state) {
        this.leaderOfState = state;
        state.leader = this;
        this.econMinisterOfState = null;
        this.foreignMinisterOfState = null;
    }
    setEcon(state) {
        this.econMinisterOfState = state;
        state.econMinister = this;
        this.leaderOfState = null;
        this.foreignMinisterOfState = null;
    }
    setForeign(state) {
        this.foreignMinisterOfState = state;
        state.foreignMinister = this;
        this.leaderOfState = null;
        this.econMinisterOfState = null;
    }
    setGovernor(autonomy) {
        this.governorOfAuto = autonomy;
    }
    addStatePermit(state) {
        if (!this.statePermits.includes(state)) {
            this.statePermits.push(state);
        }
    }
    removeStatePermit(state) {
        this.statePermits = this.statePermits.filter((s) => s !== state);
    }
    addRegionPermit(region) {
        if (!this.regionPermits.includes(region)) {
            this.regionPermits.push(region);
        }
    }
    removeRegionPermit(region) {
        this.regionPermits = this.regionPermits.filter((r) => r !== region);
    }
    toJSON() {
        return {
            lastUpdate: this.lastUpdate,
            id: this.id,
            name: this.name,
            level: this.level,
            exp: this.exp,
            perks: this.perks,
            region: this.region?.id,
            residency: this.residency?.id,
            homelandBonus: this.homelandBonus?.id,
            leaderOfState: this.leaderOfState?.id,
            econMinisterOfState: this.econMinisterOfState?.id,
            foreignMinisterOfState: this.foreignMinisterOfState?.id,
            governorOfAuto: this.governorOfAuto?.id,
            party: this.party?.id,
            storage: this.storage,
            statePermits: this.statePermits.map((state) => state.id),
            regionPermits: this.regionPermits.map((region) => region.id),
        };
    }
}
exports.Player = Player;
