import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { PageableResponse } from '../app/Models/Pageable';
import { ProjektModel } from '../app/Models/Projekt';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProjektYourService {
  private readonly BASE_URL = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: 'Basic ' + btoa('admin:admin'),
    });
  }

  /**
   * Pobierz projekty przypisane do studenta
   * @param studentId - ID studenta
   * @param pageIndex - numer strony
   * @param pageSize - rozmiar strony
   */
  getProjectsByStudent(
    studentId: number,
    pageIndex: number,
    pageSize: number
  ): Observable<PageableResponse<ProjektModel>> {
    const headers = this.getAuthHeaders();
    const params = new HttpParams()
      .set('page', pageIndex.toString())
      .set('size', pageSize.toString());

    return this.http
      .get<PageableResponse<ProjektModel>>(
        `${this.BASE_URL}/projekty/student/${studentId}`,
        { headers, params }
      )
      .pipe(
        tap((response) =>
          console.log(`Pobrano projekty dla studenta (${studentId}):`, response)
        ),
        catchError((error) => {
          console.error(`Błąd podczas pobierania projektów dla studenta (${studentId}):`, error);
          return throwError(error);
        })
      );
  }


  /**
   * Pobierz projekty z opcjonalnym filtrem nazwy
   * @param name - opcjonalna nazwa projektu do filtrowania
   * @param pageIndex - numer strony
   * @param pageSize - rozmiar strony
   */
  getFilteredProjects(
    name: string,
    pageIndex: number,
    pageSize: number
  ): Observable<PageableResponse<ProjektModel>> {
    const headers = this.getAuthHeaders();
    const params = new HttpParams()
      .set('name', name || '')
      .set('page', pageIndex.toString())
      .set('size', pageSize.toString());

    return this.http
      .get<PageableResponse<ProjektModel>>(`${this.BASE_URL}/projekty`, {
        headers,
        params,
      })
      .pipe(
        tap((response) =>
          console.log('Pobrano filtrowane projekty:', response.content)
        ),
        catchError((error) => {
          console.error('Błąd podczas filtrowania projektów:', error);
          return throwError(error);
        })
      );
  }

  /**
   * Pobierz szczegóły projektu po ID
   * @param projektId - ID projektu
   */
  getProjektById(projektId: number): Observable<ProjektModel> {
    const headers = this.getAuthHeaders();
    return this.http
      .get<ProjektModel>(`${this.BASE_URL}/projekty/${projektId}`, { headers })
      .pipe(
        tap((response) =>
          console.log(`Pobrano szczegóły projektu (${projektId}):`, response)
        ),
        catchError((error) => {
          console.error(
            `Błąd podczas pobierania szczegółów projektu (${projektId}):`,
            error
          );
          return throwError(error);
        })
      );
  }

  /**
   * Dodaj nowy projekt
   * @param projekt - dane projektu
   */
  addProjekt(projekt: ProjektModel): Observable<ProjektModel> {
    const headers = this.getAuthHeaders();
    return this.http
      .post<ProjektModel>(`${this.BASE_URL}/projekty`, projekt, { headers })
      .pipe(
        tap((response) =>
          console.log('Pomyślnie dodano projekt:', response)
        ),
        catchError((error) => {
          console.error('Błąd podczas dodawania projektu:', error);
          return throwError(error);
        })
      );
  }
}
