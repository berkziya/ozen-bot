import { Autonomy } from './entity/Autonomy';
import { Player } from './entity/Player';
import { Region } from './entity/Region';
import { State } from './entity/State';
export default class ModelHandler {
    private models;
    getAutonomy(autonomyId: number | string): Promise<Autonomy>;
    getPlayer(playerId: number | string): Promise<Player>;
    getRegion(regionId: number | string): Promise<Region>;
    getState(stateId: number | string): Promise<State>;
}
