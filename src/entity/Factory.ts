import { dotless } from '../misc/utils';
import { Player } from './Player';
import { Region } from './Region';

export const resourceToId = {
  gold: 6,
  oil: 2,
  ore: 5,
  uranium: 11,
  diamonds: 15,
  liquidOxygen: 21,
  helium3: 24,
};

export class Factory {
  lastUpdate: Date = new Date(0);
  id: number;

  name: string;

  level: number = 1;
  owner!: Player;
  region!: Region;

  wage_: number = 0;
  isFixed: boolean = false;
  potentialWage: number = 0;

  type_!: keyof typeof resourceToId;

  constructor(id_: number) {
    this.id = id_;
    this.name = 'factory/' + this.id.toString();
  }

  setOwner(player: Player) {
    this.owner = player;
    player.addFactory(this);
  }

  setRegion(region: Region) {
    this.region = region;
    region.factories.add(this);
  }

  setWage(wage: string) {
    if (wage.includes('%') || (this.type !== 'gold' && !wage.includes('$'))) {
      wage = wage.split(' ')[0];
      this.wage_ = dotless(wage) / 100;
      this.isFixed = false;
    } else {
      this.wage_ = dotless(wage);
      this.isFixed = true;
    }
  }

  get wage() {
    return this.isFixed ? this.wage_ : this.wage_ * Math.pow(this.level, 0.8);
  }

  get type(): string {
    return this.type_;
  }

  set type(theType: string) {
    if (theType === 'diamond') {
      this.type_ = 'diamonds';
    } else if (theType === 'liquifaction') {
      this.type_ = 'liquidOxygen';
    } else {
      this.type_ = theType as keyof typeof resourceToId;
    }
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      level: this.level,
      owner: this.owner?.id,
      region: this.region?.id,
      wage: this.wage,
      isFixed: this.isFixed,
      potentialWage: this.potentialWage,
      type: this.type,
    };
  }
}
