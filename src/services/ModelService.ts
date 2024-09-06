import { Autonomy } from '../entity/Autonomy';
import { Bloc } from '../entity/Bloc';
import { Factory } from '../entity/Factory';
import { Player } from '../entity/Player';
import { Region } from '../entity/Region';
import { State } from '../entity/State';
import { War } from '../entity/War';

export class ModelService {
  private static instance: ModelService;

  private models = {
    autonomies: new Map<number, Autonomy>(),
    blocs: new Map<number, Bloc>(),
    factories: new Map<number, Factory>(),
    players: new Map<number, Player>(),
    regions: new Map<number, Region>(),
    states: new Map<number, State>(),
    wars: new Map<number, War>(),
  };

  private constructor() {}

  public static getInstance(): ModelService {
    if (!ModelService.instance) {
      ModelService.instance = new ModelService();
    }
    return ModelService.instance;
  }

  private async getModel<T>(
    modelMap: Map<number, T>,
    id: number | string,
    ModelClass: new (id: number) => T
  ): Promise<T> {
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

  async getAutonomy(autonomyId: number | string) {
    return this.getModel(this.models.autonomies, autonomyId, Autonomy);
  }

  async getBloc(blocId: number | string) {
    return this.getModel(this.models.blocs, blocId, Bloc);
  }

  async getFactory(factoryId: number | string) {
    return this.getModel(this.models.factories, factoryId, Factory);
  }

  async getPlayer(playerId: number | string) {
    return this.getModel(this.models.players, playerId, Player);
  }

  async getRegion(regionId: number | string) {
    return this.getModel(this.models.regions, regionId, Region);
  }

  async getState(stateId: number | string) {
    return this.getModel(this.models.states, stateId, State);
  }

  async getWar(warId: number | string) {
    return this.getModel(this.models.wars, warId, War);
  }
}
