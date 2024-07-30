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
exports.Party = void 0;
const typeorm_1 = require("typeorm");
const Player_1 = require("./Player");
const Region_1 = require("./Region");
let Party = class Party {
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
};
exports.Party = Party;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], Party.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Party.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Region_1.Region)
], Party.prototype, "region", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Player_1.Player)
], Party.prototype, "leader", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Array)
], Party.prototype, "secretaries", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Player_1.Player, (player) => player.party, {
        onDelete: 'SET NULL',
    }),
    __metadata("design:type", Array)
], Party.prototype, "members", void 0);
exports.Party = Party = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Number])
], Party);
