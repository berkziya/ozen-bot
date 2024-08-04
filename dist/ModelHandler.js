"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Autonomy_1 = require("./entity/Autonomy");
const Player_1 = require("./entity/Player");
const Region_1 = require("./entity/Region");
const State_1 = require("./entity/State");
const utils_1 = require("./misc/utils");
class ModelHandler {
    models = {
        autonomies: new Map(),
        // blocs: new Map<number, Bloc>(),
        // factories: new Map<number, Factory>(),
        players: new Map(),
        regions: new Map(),
        states: new Map(),
        // wars: new Map<number, War>(),
    };
    async getAutonomy(autonomyId) {
        if (typeof autonomyId === 'string') {
            autonomyId = (0, utils_1.dotless)(autonomyId);
        }
        let autonomy = this.models.autonomies.get(autonomyId);
        if (!autonomy) {
            autonomy = new Autonomy_1.Autonomy(autonomyId);
            this.models.autonomies.set(autonomyId, autonomy);
        }
        return autonomy;
    }
    // async getBloc(blocId: number | string) {
    //   if (typeof blocId === 'string') {
    //     blocId = dotless(blocId);
    //   }
    //   let bloc = this.models.blocs.get(blocId);
    //   if (!bloc) {
    //     bloc = new Bloc(blocId);
    //     this.models.blocs.set(blocId, bloc);
    //   }
    //   return bloc;
    // }
    // async getFactory(factoryId: number | string) {
    //   if (typeof factoryId === 'string') {
    //     factoryId = dotless(factoryId);
    //   }
    //   let factory = this.models.factories.get(factoryId);
    //   if (!factory) {
    //     factory = new Factory(factoryId);
    //     this.models.factories.set(factoryId, factory);
    //   }
    //   return factory;
    // }
    async getPlayer(playerId) {
        if (typeof playerId === 'string') {
            playerId = (0, utils_1.dotless)(playerId);
        }
        let player = this.models.players.get(playerId);
        if (!player) {
            player = new Player_1.Player(playerId);
            this.models.players.set(playerId, player);
        }
        return player;
    }
    async getRegion(regionId) {
        if (typeof regionId === 'string') {
            regionId = (0, utils_1.dotless)(regionId);
        }
        let region = this.models.regions.get(regionId);
        if (!region) {
            region = new Region_1.Region(regionId);
            this.models.regions.set(regionId, region);
        }
        return region;
    }
    async getState(stateId) {
        if (typeof stateId === 'string') {
            stateId = (0, utils_1.dotless)(stateId);
        }
        let state = this.models.states.get(stateId);
        if (!state) {
            state = new State_1.State(stateId);
            this.models.states.set(stateId, state);
        }
        return state;
    }
}
exports.default = ModelHandler;
