import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PageableResponse } from '../app/Models/Pageable';
import { ProjektModel } from '../app/Models/Projekt';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjektService {

  constructor(private http: HttpClient) { }

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



  getProjekt(page: number, size: number) {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa('admin:admin')
    });

    return this.http.get<PageableResponse<ProjektModel[]>>(
      `http://localhost:8080/api/projekty?page=${page}&size=${size}&sort=nazwa`,
      { headers }
    ).pipe(
      tap(response => console.log('Odpowiedź:', response)),
      catchError(error => {
        console.error('Błąd:', error);
        return throwError(error);
      })
    );
  }

}
