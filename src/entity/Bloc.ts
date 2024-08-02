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
}
