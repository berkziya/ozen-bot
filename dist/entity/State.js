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
exports.State = void 0;
const typeorm_1 = require("typeorm");
const Player_1 = require("./Player");
const Region_1 = require("./Region");
const Autonomy_1 = require("./Autonomy");
let State = class State {
    id;
    name;
    regions;
    autonomies;
    governmentForm = 'Dictatorship';
    leader = null;
    leaderIsCommander = false;
    econMinister = null;
    foreignMinister = null;
    leaderTermStart = null;
    constructor(id_) {
        this.id = id_;
        this.name = 'state/' + this.id.toString();
        this.regions = [];
        this.autonomies = [];
    }
};
exports.State = State;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], State.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], State.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Region_1.Region, (region) => region.state),
    __metadata("design:type", Array)
], State.prototype, "regions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Autonomy_1.Autonomy, (autonomy) => autonomy.state),
    __metadata("design:type", Array)
], State.prototype, "autonomies", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], State.prototype, "governmentForm", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Player_1.Player, (player) => player.leaderOfState, {
        nullable: true,
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Object)
], State.prototype, "leader", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], State.prototype, "leaderIsCommander", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Player_1.Player, (player) => player.econMinisterOfState, {
        nullable: true,
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Object)
], State.prototype, "econMinister", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Player_1.Player, (player) => player.foreignMinisterOfState, {
        nullable: true,
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Object)
], State.prototype, "foreignMinister", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Object)
], State.prototype, "leaderTermStart", void 0);
exports.State = State = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Number])
], State);
