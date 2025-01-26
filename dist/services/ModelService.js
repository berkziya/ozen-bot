import { Autonomy, Bloc, Factory, Player, Region, State, War } from '../entity';
export default class ModelService {
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
        return this.getModel(this.models.autonomies, autonomyId, Autonomy);
    }
    async getBloc(blocId) {
        return this.getModel(this.models.blocs, blocId, Bloc);
    }
    async getFactory(factoryId) {
        return this.getModel(this.models.factories, factoryId, Factory);
    }
    async getPlayer(playerId) {
        return this.getModel(this.models.players, playerId, Player);
    }
    async getRegion(regionId) {
        return this.getModel(this.models.regions, regionId, Region);
    }
    async getState(stateId) {
        return this.getModel(this.models.states, stateId, State);
    }
    async getWar(warId) {
        return this.getModel(this.models.wars, warId, War);
    }
}
