import { Autonomy } from './entity/Autonomy';
import { Factory } from './entity/Factory';
import { Player } from './entity/Player';
import { Region } from './entity/Region';
import { State } from './entity/State';
export default class ModelHandler {
    private models;
    getAutonomy(autonomyId: number | string): Promise<Autonomy>;
    getFactory(factoryId: number | string): Promise<Factory>;
    getPlayer(playerId: number | string): Promise<Player>;
    getRegion(regionId: number | string): Promise<Region>;
    getState(stateId: number | string): Promise<State>;
}
