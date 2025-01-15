import { StudentModel } from "./Student";

export interface ProjektModel{
    projektId: number,
    nazwa: string,
    opis: string,
    dataczasUtworzenia: string,
    dataOddania: string,
    studenci: StudentModel[]
}

export interface ProjektWithTaskModel extends ProjektModel{
    zadania: ZadanieModel[]
}

export interface ZadanieModel{
    zadanieId: number,
    nazwa: string,
    kolejnosc: number,
    opis: string,
    dataCzasOddania: string;
    status?: 'backlog' | 'todo' | 'in-progress' | 'done';
}
