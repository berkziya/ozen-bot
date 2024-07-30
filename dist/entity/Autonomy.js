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
exports.Autonomy = void 0;
const typeorm_1 = require("typeorm");
const Player_1 = require("./Player");
const Region_1 = require("./Region");
const State_1 = require("./State");
const Storage_1 = require("./shared/Storage");
let Autonomy = class Autonomy {
    lastUpdate = 0;
    id;
    name;
    state;
    capital;
    regions;
    governor;
    storage = new Storage_1.Storage();
    constructor(id_) {
        this.id = id_;
        this.name = 'autonomy/' + this.id.toString();
        this.regions = [];
        this.governor = null;
    }
    toJSON() {
        return {
            lastUpdate: this.lastUpdate,
            id: this.id,
            name: this.name,
            state: this.state,
            capital: this.capital,
            regions: this.regions,
            governor: this.governor,
        };
    }
};
exports.Autonomy = Autonomy;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], Autonomy.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Autonomy.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => State_1.State, (state) => state.autonomies),
    __metadata("design:type", State_1.State)
], Autonomy.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Region_1.Region)
], Autonomy.prototype, "capital", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Region_1.Region, (region) => region.autonomy),
    __metadata("design:type", Array)
], Autonomy.prototype, "regions", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Player_1.Player, (player) => player.governorOfAuto, {
        nullable: true,
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Object)
], Autonomy.prototype, "governor", void 0);
exports.Autonomy = Autonomy = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Number])
], Autonomy);
