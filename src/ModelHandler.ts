import { Autonomy } from './entity/Autonomy';
import { Player } from './entity/Player';
import { Region } from './entity/Region';
import { State } from './entity/State';
import { dotless } from './misc/utils';

// import { Factory } from './entity/Factory';

export default class ModelHandler {
  private models = {
    autonomies: new Map<number, Autonomy>(),
    // blocs: new Map<number, Bloc>(),
    // factories: new Map<number, Factory>(),
    players: new Map<number, Player>(),
    regions: new Map<number, Region>(),
    states: new Map<number, State>(),
    // wars: new Map<number, War>(),
  };

  async getAutonomy(autonomyId: number | string) {
    if (typeof autonomyId === 'string') {
      autonomyId = dotless(autonomyId);
    }

    let autonomy = this.models.autonomies.get(autonomyId);
    if (!autonomy) {
      autonomy = new Autonomy(autonomyId);
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

  async getPlayer(playerId: number | string) {
    if (typeof playerId === 'string') {
      playerId = dotless(playerId);
    }

    let player = this.models.players.get(playerId);
    if (!player) {
      player = new Player(playerId);
      this.models.players.set(playerId, player);
    }
    return player;
  }

  async getRegion(regionId: number | string) {
    if (typeof regionId === 'string') {
      regionId = dotless(regionId);
    }

    let region = this.models.regions.get(regionId);
    if (!region) {
      region = new Region(regionId);
      this.models.regions.set(regionId, region);
    }
    return region;
  }

  async getState(stateId: number | string) {
    if (typeof stateId === 'string') {
      stateId = dotless(stateId);
    }

    let state = this.models.states.get(stateId);
    if (!state) {
      state = new State(stateId);
      this.models.states.set(stateId, state);
    }
    return state;
  }

  // async getWar(warId: number | string) {
  //   if (typeof warId === 'string') {
  //     warId = dotless(warId);
  //   }

  //   let war = this.models.wars.get(warId);
  //   if (!war) {
  //     war = new War(warId);
  //     this.models.wars.set(warId, war);
  //   }
  //   return war;
  // }
}
