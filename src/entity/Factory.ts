import { Player } from './Player';
import { Region } from './Region';

export class Factory {
  lastUpdate: Date = new Date(0);
  id: number;

  name: string;

  owner?: Player;
  region?: Region;

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
}
