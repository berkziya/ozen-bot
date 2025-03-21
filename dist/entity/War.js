export class War {
    lastUpdate = new Date(0);
    id;
    name;
    type;
    endingTime;
    aggressor;
    defender;
    aggressorDamage = 0;
    defenderDamage = 0;
    aggresorPlayers = new Map();
    defenderPlayers = new Map();
    constructor(id_) {
        this.id = id_;
        this.name = 'war/' + this.id.toString();
    }
    toJSON() {
        return {
            lastUpdate: this.lastUpdate,
            id: this.id,
            name: this.name,
            type: this.type,
            endingTime: this.endingTime,
            aggresor: this.aggressor.id,
            defender: this.defender.id,
            aggressorDamage: this.aggressorDamage,
            defenderDamage: this.defenderDamage,
            aggresorPlayers: Array.from(this.aggresorPlayers, ([player, damage]) => {
                return { player: player.id, damage };
            }),
            defenderPlayers: Array.from(this.defenderPlayers, ([player, damage]) => {
                return { player: player.id, damage };
            }),
        };
    }
    static [Symbol.hasInstance](instance) {
        return (instance && typeof instance === 'object' && 'aggressorDamage' in instance);
    }
}
