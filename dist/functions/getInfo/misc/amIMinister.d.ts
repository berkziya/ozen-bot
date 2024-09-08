export declare function amIMinister(playerId: number): Promise<{
    leader: boolean;
    dicta: boolean;
    econ: boolean;
    foreign: boolean;
    governor: boolean;
}>;
