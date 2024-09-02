import { State } from './State';
export declare class Bloc {
    lastUpdate: Date;
    id: number;
    name: string;
    states: Set<State>;
    militaryAgreement: boolean;
    openBorders: boolean;
    constructor(id_: number);
    addState(state: State): void;
    toJSON(): {
        lastUpdate: Date;
        id: number;
        name: string;
        states: number[];
        militaryAgreement: boolean;
        openBorders: boolean;
    };
    static [Symbol.hasInstance](instance: any): boolean;
}
