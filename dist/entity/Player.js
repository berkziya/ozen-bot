"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const Storage_1 = require("./shared/Storage");
const Region_1 = require("./Region");
const State_1 = require("./State");
const Autonomy_1 = require("./Autonomy");
const typeorm_1 = require("typeorm");
const Party_1 = require("./Party");
let Player = class Player {
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
};
exports.Player = Player;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], Player.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('string'),
    __metadata("design:type", String)
], Player.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { default: 30 }),
    __metadata("design:type", Number)
], Player.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Player.prototype, "exp", void 0);
__decorate([
    (0, typeorm_1.Column)('json'),
    __metadata("design:type", Object)
], Player.prototype, "perks", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Region_1.Region, (region) => region.citizens),
    __metadata("design:type", Region_1.Region)
], Player.prototype, "region", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Region_1.Region, (region) => region.residents),
    __metadata("design:type", Region_1.Region)
], Player.prototype, "residency", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: null }),
    __metadata("design:type", Object)
], Player.prototype, "homelandBonus", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => State_1.State, (state) => state.leader, { nullable: true }),
    __metadata("design:type", Object)
], Player.prototype, "leaderOfState", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => State_1.State, (state) => state.econMinister, { nullable: true }),
    __metadata("design:type", Object)
], Player.prototype, "econMinisterOfState", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => State_1.State, (state) => state.foreignMinister, { nullable: true }),
    __metadata("design:type", Object)
], Player.prototype, "foreignMinisterOfState", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Autonomy_1.Autonomy, (autonomy) => autonomy.governor, { nullable: true }),
    __metadata("design:type", Object)
], Player.prototype, "governorOfAuto", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Party_1.Party, (party) => party.members, { nullable: true }),
    __metadata("design:type", Object)
], Player.prototype, "party", void 0);
exports.Player = Player = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Number])
], Player);
