import { Player } from './Player';
import { Region } from './Region';

export class Party {
  lastUpdate: Date = new Date(0);

  id: number;

  name: string;

  region?: Region;

  leader?: Player;
  secretaries: Set<Player>;
  members: Set<Player>;

  constructor(id_: number) {
    this.id = id_;
    this.name = 'party/' + this.id.toString();
    this.secretaries = new Set();
    this.members = new Set();
  }

  setRegion(region: Region) {
    this.region = region;
    region.parties.add(this);
  }

  setLeader(player: Player) {
    this.leader = player;
    player.party = this;
  }

  addSecretary(player: Player) {
    this.secretaries.add(player);
    player.party = this;
  }

  addMember(player: Player) {
    if (player.party) {
      player.party.members.delete(player);
    }
    this.members.add(player);
    player.party = this;
  }

  removeMember(player: Player) {
    if (player.party === this) {
      player.party = null;
    }
    this.members.delete(player);
  }

  // toJSON() {
  //   return {
  //     lastUpdate: this.lastUpdate,
  //     id: this.id,
  //     name: this.name,
  //     region: this.region?.id,
  //     leader: this.leader?.id,
  //     secretaries: Array.from(this.secretaries, (secretary) => secretary.id),
  //     members: Array.from(this.members, (member) => member.id),
  //   };
  // }
}
