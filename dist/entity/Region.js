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
exports.Region = void 0;
const State_1 = require("./State");
const Autonomy_1 = require("./Autonomy");
const typeorm_1 = require("typeorm");
const Player_1 = require("./Player");
let Region = class Region {
    lastUpdate = 0;
    id;
    name;
    state = null;
    autonomy = null;
    borderRegions;
    buildings = {
        militaryAcademy: 0,
        hospital: 0,
        militaryBase: 0,
        school: 0,
        missileSystem: 0,
        seaPort: 0,
        powerPlant: 0,
        spaceport: 0,
        airport: 0,
        houseFund: 0,
    };
    seaAccess = false;
    citizens;
    residents;
    resources = {
        gold: 0,
        oil: 0,
        ore: 0,
        uranium: 0,
        diamonds: 0,
    };
    constructor(id_) {
        this.id = id_;
        this.name = 'region/' + this.id.toString();
        this.citizens = [];
        this.residents = [];
        this.borderRegions = [];
    }
    powerProduction() {
        return this.buildings.powerPlant * 10;
    }
    powerConsumption() {
        return ((this.buildings.hospital +
            this.buildings.militaryBase +
            this.buildings.school +
            this.buildings.missileSystem +
            this.buildings.seaPort +
            this.buildings.spaceport +
            this.buildings.airport) *
            2);
    }
    initialAttack() {
        return this.buildings.militaryAcademy * 900_000;
    }
    initialDefense() {
        return (this.buildings.militaryAcademy * 900_000 +
            this.buildings.hospital * 100_000 +
            this.buildings.militaryBase * 200_000 +
            this.buildings.school * 100_000 +
            this.buildings.missileSystem * 100_000 +
            this.buildings.seaPort * 100_000 +
            this.buildings.powerPlant * 100_000 +
            this.buildings.spaceport * 100_000 +
            this.buildings.airport * 100_000);
    }
    toJSON() {
        return {
            lastUpdate: this.lastUpdate,
            id: this.id,
            name: this.name,
            state: this.state?.id,
            autonomy: this.autonomy?.id,
            borderRegions: this.borderRegions.map((region) => region.id),
            buildings: this.buildings,
            seaAccess: this.seaAccess,
            citizens: this.citizens.map((player) => player.id),
            residents: this.residents.map((player) => player.id),
            resources: this.resources,
        };
    }
};
exports.Region = Region;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], Region.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Region.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => State_1.State, (state) => state.regions, {
        nullable: true,
        onDelete: 'SET NULL',
    }),
    __metadata("design:type", Object)
], Region.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Autonomy_1.Autonomy, (autonomy) => autonomy.regions, {
        nullable: true,
        onDelete: 'SET NULL',
    }),
    __metadata("design:type", Object)
], Region.prototype, "autonomy", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Array)
], Region.prototype, "borderRegions", void 0);
__decorate([
    (0, typeorm_1.Column)('json'),
    __metadata("design:type", Object)
], Region.prototype, "buildings", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Region.prototype, "seaAccess", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Player_1.Player, (player) => player.region),
    __metadata("design:type", Array)
], Region.prototype, "citizens", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Player_1.Player, (player) => player.residency),
    __metadata("design:type", Array)
], Region.prototype, "residents", void 0);
__decorate([
    (0, typeorm_1.Column)('json'),
    __metadata("design:type", Object)
], Region.prototype, "resources", void 0);
exports.Region = Region = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Number])
], Region);
