"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = void 0;
const utils_1 = require("../misc/utils");
const Storage_1 = require("./shared/Storage");
class State {
    lastUpdate = new Date(0);
    id;
    name;
    capital;
    regions;
    autonomies;
    governmentForm = 'dictatorship';
    leader = null;
    leaderIsCommander = false;
    econMinister = null;
    foreignMinister = null;
    leaderTermStart = null;
    entryFee = 0;
    bordersOpen = false;
    needResidencyToWork = false;
    residencyIssuedByLeader = false;
    storage = new Storage_1.Storage(this);
    bloc = null;
    // permits: Set<Player>;
    constructor(id_) {
        this.id = id_;
        this.name = 'state/' + this.id.toString();
        this.regions = new Set();
        this.autonomies = new Set();
        // this.permits = new Set();
    }
    setCapital(region) {
        if (region.state) {
            region.state.regions.delete(region);
        }
        this.capital = region;
        region.state = this;
        region.autonomy = null;
    }
    addRegion(region) {
        if (region.state) {
            region.state.regions.delete(region);
        }
        this.regions.add(region);
        region.state = this;
    }
    removeRegion(region) {
        this.regions.delete(region);
        if (region.state === this) {
            region.state = null;
        }
    }
    addAutonomy(autonomy) {
        if (autonomy.state) {
            autonomy.state.autonomies.delete(autonomy);
        }
        this.autonomies.add(autonomy);
        autonomy.state = this;
    }
    setgovernmentForm(form) {
        this.governmentForm = (0, utils_1.toCamelCase)(form);
    }
    setLeader(player) {
        if (this.leader && this.leader.leaderOfState === this) {
            this.leader.leaderOfState = null;
        }
        this.leader = player;
        if (player) {
            player.leaderOfState = this;
            player.econMinisterOfState = null;
            player.foreignMinisterOfState = null;
        }
    }
    setEconMinister(player) {
        if (this.econMinister && this.econMinister.econMinisterOfState === this) {
            this.econMinister.econMinisterOfState = null;
        }
        this.econMinister = player;
        if (player) {
            player.econMinisterOfState = this;
            player.leaderOfState = null;
            player.foreignMinisterOfState = null;
        }
    }
    setForeignMinister(player) {
        if (this.foreignMinister &&
            this.foreignMinister.foreignMinisterOfState === this) {
            this.foreignMinister.foreignMinisterOfState = null;
        }
        this.foreignMinister = player;
        if (player) {
            player.foreignMinisterOfState = this;
            player.econMinisterOfState = null;
            player.leaderOfState = null;
        }
    }
    toJSON() {
        return {
            lastUpdate: this.lastUpdate,
            id: this.id,
            name: this.name,
            regions: Array.from(this.regions, (region) => region.id),
            autonomies: Array.from(this.autonomies, (autonomy) => autonomy.id),
            governmentForm: this.governmentForm,
            leader: this.leader?.id,
            leaderIsCommander: this.leaderIsCommander,
            econMinister: this.econMinister?.id,
            foreignMinister: this.foreignMinister?.id,
            leaderTermStart: this.leaderTermStart,
        };
    }
}
exports.State = State;
