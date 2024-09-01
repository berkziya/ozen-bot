"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Autonomy_1 = require("../entity/Autonomy");
// import { Bloc } from '../entity/Bloc';
const Factory_1 = require("../entity/Factory");
const Player_1 = require("../entity/Player");
const Region_1 = require("../entity/Region");
const State_1 = require("../entity/State");
const War_1 = require("../entity/War");
class ModelService {
    static instance;
    models = {
        autonomies: new Map(),
        // blocs: new Map<number, Bloc>(),
        factories: new Map(),
        players: new Map(),
        regions: new Map(),
        states: new Map(),
        wars: new Map(),
    };
    constructor() { }
    static getInstance() {
        if (!ModelService.instance) {
            ModelService.instance = new ModelService();
        }
        return ModelService.instance;
    }
    async getModel(modelMap, id, ModelClass) {
        if (typeof id === 'string') {
            id = parseInt(id);
        }
        let model = modelMap.get(id);
        if (!model) {
            model = new ModelClass(id);
            modelMap.set(id, model);
        }
        return model;
    }
    async getAutonomy(autonomyId) {
        return this.getModel(this.models.autonomies, autonomyId, Autonomy_1.Autonomy);
    }
    // async getBloc(blocId: number | string) {
    //   return this.getModel(this.models.blocs, blocId, Bloc);
    // }
    async getFactory(factoryId) {
        return this.getModel(this.models.factories, factoryId, Factory_1.Factory);
    }
    async getPlayer(playerId) {
        return this.getModel(this.models.players, playerId, Player_1.Player);
    }
    async getRegion(regionId) {
        return this.getModel(this.models.regions, regionId, Region_1.Region);
    }
    async getState(stateId) {
        return this.getModel(this.models.states, stateId, State_1.State);
    }
    async getWar(warId) {
        return this.getModel(this.models.wars, warId, War_1.War);
    }
}
exports.default = ModelService;
