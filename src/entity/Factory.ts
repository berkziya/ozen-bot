import { dotless } from '../misc/utils';
import { Player } from './Player';
import { Region } from './Region';

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

  type_!:
    | 'gold'
    | 'oil'
    | 'ore'
    | 'uranium'
    | 'diamonds'
    | 'liquidOxygen'
    | 'helium3';

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
      this.type_ = theType as
        | 'gold'
        | 'oil'
        | 'ore'
        | 'uranium'
        | 'liquidOxygen';
    }
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      level: this.level,
      owner: this.owner.id,
      region: this.region.id,
      wage: this.wage,
      isFixed: this.isFixed,
      potentialWage: this.potentialWage,
      type: this.type,
    };
  }
}
