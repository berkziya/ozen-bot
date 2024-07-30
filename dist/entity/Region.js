"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Region = void 0;
class Region {
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
}
exports.Region = Region;
