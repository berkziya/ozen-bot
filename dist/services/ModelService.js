"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entity_1 = require("../entity");
class ModelService {
    static instance;
    models = {
        autonomies: new Map(),
        blocs: new Map(),
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
        return this.getModel(this.models.autonomies, autonomyId, entity_1.Autonomy);
    }
    async getBloc(blocId) {
        return this.getModel(this.models.blocs, blocId, entity_1.Bloc);
    }
    async getFactory(factoryId) {
        return this.getModel(this.models.factories, factoryId, entity_1.Factory);
    }
    async getPlayer(playerId) {
        return this.getModel(this.models.players, playerId, entity_1.Player);
    }
    async getRegion(regionId) {
        return this.getModel(this.models.regions, regionId, entity_1.Region);
    }
    async getState(stateId) {
        return this.getModel(this.models.states, stateId, entity_1.State);
    }
    async getWar(warId) {
        return this.getModel(this.models.wars, warId, entity_1.War);
    }
}
exports.default = ModelService;
