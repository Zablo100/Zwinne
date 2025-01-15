import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PageableResponse } from '../app/Models/Pageable';
import { ProjektModel } from '../app/Models/Projekt';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProjektService {

  private readonly BASE_URL = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: 'Basic ' + btoa('admin:admin'),
    });
  }

  getFilteredProjects(name: string, pageIndex: number, pageSize: number) {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa('admin:admin')
    });

    const params = {
      name: name || '',
      page: pageIndex.toString(),
      size: pageSize.toString(),
    };

    return this.http.get<PageableResponse<ProjektModel[]>>('http://localhost:8080/api/projekty', { headers, params }).pipe(

      catchError(error => {
        console.error('Błąd podczas filtrowania projektów:', error);
        return throwError(error);
      })
    );
  }

  getProjektById(projektId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http
      .get<any>(`${this.BASE_URL}/projekty/${projektId}`, { headers })
      .pipe(
        catchError((error) => {
          console.error(`Błąd podczas pobierania szczegółó projektu:`, error);
          return throwError(error);
        })
      );
  }

  addProjekt(projekt: any): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/projekty`, projekt).pipe(
      catchError((error) => {
        console.error('Błąd podczas dodawania projektu:', error);
        return throwError(error);
      })
    );
  }

  // getProjekt(page: number, size: number) {
  //   const headers = new HttpHeaders({
  //     'Authorization': 'Basic ' + btoa('admin:admin')
  //   });
  //
  //   return this.http.get<PageableResponse<ProjektModel[]>>(
  //     `http://localhost:8080/api/projekty?page=${page}&size=${size}&sort=nazwa`,
  //     { headers }
  //   ).pipe(
  //     tap(response => console.log('Odpowiedź:', response)),
  //     catchError(error => {
  //       console.error('Błąd:', error);
  //       return throwError(error);
  //     })
  //   );
  // }



}
