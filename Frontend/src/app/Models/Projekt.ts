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
    files: FileProjectModel[];  // Nowe pole na pliki

}

export interface ZadanieModel{
    zadanieId: number,
    nazwa: string,
    kolejnosc: number,
    opis: string,
    dataCzasOddania: string;
    status?: 'backlog' | 'todo' | 'in-progress' | 'done';
}
export interface FileProjectModel{
  fileId: number,
  sciezka: string;
}
