"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Factory = void 0;
class Factory {
    lastUpdate = new Date(0);
    id;
    name;
    owner;
    region;
    constructor(id_) {
        this.id = id_;
        this.name = 'factory/' + this.id.toString();
    }
    setOwner(player) {
        this.owner = player;
        player.addFactory(this);
    }
    setRegion(region) {
        this.region = region;
        region.factories.add(this);
    }
}
exports.Factory = Factory;
