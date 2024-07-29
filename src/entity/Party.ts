import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Player } from './Player';
import { Region } from './Region';

@Entity()
export class Party {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  region?: Region;

  @Column()
  leader?: Player;

  @Column()
  secretaries: Player[];

  @OneToMany(() => Player, (player) => player.party, {
    onDelete: 'SET NULL',
  })
  members: Player[];

  constructor(id_: number) {
    this.id = id_;
    this.name = 'party/' + this.id.toString();
    this.secretaries = [];
    this.members = [];
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      region: this.region,
      leader: this.leader,
      secretaries: this.secretaries,
      members: this.members,
    };
  }
}
