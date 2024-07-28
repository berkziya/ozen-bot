import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Player } from './Player';
import { Region } from './Region';
import { State } from './State';
import { Storage } from './shared/Storage';

@Entity()
export class Autonomy {
  @PrimaryColumn()
  id: Number;

  @Column()
  name: string;

  @ManyToOne(() => State, (state) => state.autonomies)
  state?: State;

  @Column()
  capital?: Region;

  @OneToMany(() => Region, (region) => region.autonomy)
  regions: Region[];

  @OneToOne(() => Player, (player) => player.governorOfAuto, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  governor: Player | null;

  storage: Storage = new Storage();

  constructor(id_: Number) {
    this.id = id_;
    this.name = 'autonomy/' + this.id.toString();
    this.regions = [];
    this.governor = null;
  }
}
