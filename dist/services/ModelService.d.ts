import { Autonomy, Bloc, Factory, Player, Region, State, War } from '../entity';
export default class ModelService {
    private static instance;
    private models;
    private constructor();
    static getInstance(): ModelService;
    private getModel;
    getAutonomy(autonomyId: number | string): Promise<Autonomy>;
    getBloc(blocId: number | string): Promise<Bloc>;
    getFactory(factoryId: number | string): Promise<Factory>;
    getPlayer(playerId: number | string): Promise<Player>;
    getRegion(regionId: number | string): Promise<Region>;
    getState(stateId: number | string): Promise<State>;
    getWar(warId: number | string): Promise<War>;
}
//# sourceMappingURL=ModelService.d.ts.map