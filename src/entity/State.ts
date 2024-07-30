import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Player } from './Player';
import { Region } from './Region';
import { Autonomy } from './Autonomy';
import { last } from 'cheerio/lib/api/traversing';

@Entity()
export class State {
  lastUpdate: number = 0;

  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Region, (region) => region.state)
  regions: Region[];

  @OneToMany(() => Autonomy, (autonomy) => autonomy.state)
  autonomies: Autonomy[];

  @Column()
  governmentForm: string = 'Dictatorship';

  @OneToOne(() => Player, (player) => player.leaderOfState, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  leader: Player | null = null;

  @Column()
  leaderIsCommander: boolean = false;

  @OneToOne(() => Player, (player) => player.econMinisterOfState, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  econMinister: Player | null = null;

  @OneToOne(() => Player, (player) => player.foreignMinisterOfState, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  foreignMinister: Player | null = null;

  @Column({ type: 'date', nullable: true })
  leaderTermStart: Date | null = null;

  constructor(id_: number) {
    this.id = id_;
    this.name = 'state/' + this.id.toString();
    this.regions = [];
    this.autonomies = [];
  }

  toJSON() {
    return {
      lastUpdate: this.lastUpdate,
      id: this.id,
      name: this.name,
      regions: this.regions.map((region) => region.id),
      autonomies: this.autonomies.map((autonomy) => autonomy.id),
      governmentForm: this.governmentForm,
      leader: this.leader?.id,
      leaderIsCommander: this.leaderIsCommander,
      econMinister: this.econMinister?.id,
      foreignMinister: this.foreignMinister?.id,
      leaderTermStart: this.leaderTermStart,
    };
  }
}
