import { Storage } from './shared/Storage';
import { Region } from './Region';
import { State } from './State';
import { Autonomy } from './Autonomy';
import { Column, Entity, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { Party } from './Party';

@Entity()
export class Player {
  @PrimaryColumn()
  id: number;

  @Column('string')
  name: string;

  @Column('int', { default: 30 })
  level: number = 30;

  @Column({ default: 0 })
  exp: number = 0;

  @Column('json')
  perks: { str: number; edu: number; end: number } = {
    str: 30,
    edu: 30,
    end: 30,
  };

  @ManyToOne(() => Region, (region) => region.citizens)
  region?: Region;

  @ManyToOne(() => Region, (region) => region.residents)
  residency?: Region;

  @Column({ nullable: true, default: null })
  homelandBonus: State | null;

  @OneToOne(() => State, (state) => state.leader, { nullable: true })
  leaderOfState: State | null;

  @OneToOne(() => State, (state) => state.econMinister, { nullable: true })
  econMinisterOfState: State | null;

  @OneToOne(() => State, (state) => state.foreignMinister, { nullable: true })
  foreignMinisterOfState: State | null;

  @OneToOne(() => Autonomy, (autonomy) => autonomy.governor, { nullable: true })
  governorOfAuto: Autonomy | null;

  @ManyToOne(() => Party, (party) => party.members, { nullable: true })
  party: Party | null;

  storage: Storage = new Storage();

  constructor(id_: number) {
    this.id = id_;
    this.name = 'player/' + this.id.toString();
    this.homelandBonus = null;
    this.leaderOfState = null;
    this.econMinisterOfState = null;
    this.foreignMinisterOfState = null;
    this.governorOfAuto = null;
    this.party = null;
  }
}
