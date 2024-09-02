import { State } from './State';

export class Bloc {
  lastUpdate: Date = new Date(0);
  id: number;

  name: string;

  states: Set<State>;

  militaryAgreement: boolean = false;
  openBorders: boolean = false;

  constructor(id_: number) {
    this.id = id_;
    this.name = 'bloc/' + this.id.toString();
    this.states = new Set();
  }

  addState(state: State) {
    this.states.add(state);
    state.bloc = this;
  }

  toJSON() {
    return {
      lastUpdate: this.lastUpdate,
      id: this.id,
      name: this.name,
      states: Array.from(this.states).map((state) => state.id),
      militaryAgreement: this.militaryAgreement,
      openBorders: this.openBorders,
    };
  }

  static [Symbol.hasInstance](instance: any): boolean {
    return (
      instance &&
      typeof instance === 'object' &&
      'militaryAgreement' in instance
    );
  }
}
