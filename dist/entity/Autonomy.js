import { Storage } from './shared/Storage';
export class Autonomy {
    lastUpdate = new Date(0);
    id;
    name;
    state;
    capital;
    regions;
    governor;
    storage = new Storage();
    constructor(id_) {
        this.id = id_;
        this.name = 'autonomy/' + this.id.toString();
        this.regions = new Set();
        this.governor = null;
        this.storage.setOwner(this);
    }
    setState(state) {
        if (this.state) {
            this.state.autonomies.delete(this);
        }
        this.state = state;
        state.autonomies.add(this);
    }
    setCapital(region) {
        this.capital = region;
        this.addRegion(region);
    }
    setGovernor(player) {
        this.governor = player;
    }
    addRegion(region) {
        this.regions.add(region);
    }
    removeRegion(region) {
        this.regions.delete(region);
    }
    toJSON() {
        return {
            lastUpdate: this.lastUpdate,
            id: this.id,
            name: this.name,
            state: this.state?.id,
            capital: this.capital?.id,
            regions: Array.from(this.regions, (region) => region.id),
            governor: this.governor?.id,
            storage: this.storage,
        };
    }
    static [Symbol.hasInstance](instance) {
        return instance && typeof instance === 'object' && 'governor' in instance;
    }
}
