"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const Storage_1 = require("./shared/Storage");
class Player {
    lastUpdate = new Date(0);
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
    factories;
    statePermits;
    regionPermits;
    constructor(id_) {
        this.id = id_;
        this.name = 'player/' + this.id.toString();
        this.homelandBonus = null;
        this.leaderOfState = null;
        this.econMinisterOfState = null;
        this.foreignMinisterOfState = null;
        this.governorOfAuto = null;
        this.party = null;
        this.statePermits = new Set();
        this.regionPermits = new Set();
        this.factories = new Set();
        this.storage.setOwner(this);
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
        if (this.region) {
            this.region.citizens.delete(this);
        }
        this.region = region;
        region.citizens.add(this);
    }
    setResidency(region) {
        if (this.residency) {
            this.residency.residents.delete(this);
        }
        this.residency = region;
        region.residents.add(this);
    }
    setParty(party) {
        this.party = party;
    }
    setHomelandBonus(state) {
        this.homelandBonus = state;
    }
    setLeader(state) {
        if (this.leaderOfState && this.leaderOfState.leader === this) {
            this.leaderOfState.leader = null;
        }
        this.leaderOfState = state;
        state.leader = this;
        this.econMinisterOfState = null;
        this.foreignMinisterOfState = null;
    }
    setEcon(state) {
        if (this.econMinisterOfState &&
            this.econMinisterOfState.econMinister === this) {
            this.econMinisterOfState.econMinister = null;
        }
        this.econMinisterOfState = state;
        state.econMinister = this;
        this.leaderOfState = null;
        this.foreignMinisterOfState = null;
    }
    setForeign(state) {
        if (this.foreignMinisterOfState &&
            this.foreignMinisterOfState.foreignMinister === this) {
            this.foreignMinisterOfState.foreignMinister = null;
        }
        this.foreignMinisterOfState = state;
        state.foreignMinister = this;
        this.leaderOfState = null;
        this.econMinisterOfState = null;
    }
    setGovernor(autonomy) {
        if (this.governorOfAuto && this.governorOfAuto.governor === this) {
            this.governorOfAuto.governor = null;
        }
        this.governorOfAuto = autonomy;
        autonomy.governor = this;
    }
    addFactory(factory) {
        this.factories.add(factory);
    }
    addStatePermit(state) {
        this.statePermits.add(state);
    }
    addRegionPermit(region) {
        this.regionPermits.add(region);
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
            factories: Array.from(this.factories, (factory) => factory.id),
            statePermits: Array.from(this.statePermits, (state) => state.id),
            regionPermits: Array.from(this.regionPermits, (region) => region.id),
        };
    }
}
exports.Player = Player;
