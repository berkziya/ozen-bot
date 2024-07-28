import { State } from './State';
import { Autonomy } from './Autonomy';
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Player } from './Player';

@Entity()
export class Region {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => State, (state) => state.regions, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  state: State | null = null;

  @ManyToOne(() => Autonomy, (autonomy) => autonomy.regions, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  autonomy: Autonomy | null = null;

  @Column()
  borderRegions: Region[];

  @Column('json')
  buildings: {
    militaryAcademy: number;
    hospital: number;
    militaryBase: number;
    school: number;
    missileSystem: number;
    seaPort: number;
    powerPlant: number;
    spaceport: number;
    airport: number;
    houseFund: number;
  } = {
    militaryAcademy: 0,
    hospital: 0,
    militaryBase: 0,
    school: 0,
    missileSystem: 0,
    seaPort: 0,
    powerPlant: 0,
    spaceport: 0,
    airport: 0,
    houseFund: 0,
  };

  @Column({ default: false })
  seaAccess: boolean = false;

  @OneToMany(() => Player, (player) => player.region)
  citizens: Player[];

  @OneToMany(() => Player, (player) => player.residency)
  residents: Player[];

  @Column('json')
  resources: {
    gold: number;
    oil: number;
    ore: number;
    uranium: number;
    diamonds: number;
  } = {
    gold: 0,
    oil: 0,
    ore: 0,
    uranium: 0,
    diamonds: 0,
  };

  constructor(id_: number) {
    this.id = id_;
    this.name = 'region/' + this.id.toString();
    this.citizens = [];
    this.residents = [];
    this.borderRegions = [];
  }

  powerProduction(): number {
    return this.buildings.powerPlant * 10;
  }

  powerConsumption(): number {
    return (
      (this.buildings.hospital +
        this.buildings.militaryBase +
        this.buildings.school +
        this.buildings.missileSystem +
        this.buildings.seaPort +
        this.buildings.spaceport +
        this.buildings.airport) *
      2
    );
  }

  initialAttack(): number {
    return this.buildings.militaryAcademy * 900_000;
  }

  initialDefense(): number {
    return (
      this.buildings.militaryAcademy * 900_000 +
      this.buildings.hospital * 100_000 +
      this.buildings.militaryBase * 200_000 +
      this.buildings.school * 100_000 +
      this.buildings.missileSystem * 100_000 +
      this.buildings.seaPort * 100_000 +
      this.buildings.powerPlant * 100_000 +
      this.buildings.spaceport * 100_000 +
      this.buildings.airport * 100_000
    );
  }
}
