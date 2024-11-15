import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProjektWithTaskModel } from '../app/Models/Projekt';
import { catchError, tap, throwError } from 'rxjs';
import { PageableResponse } from '../app/Models/Pageable';

@Injectable({
  providedIn: 'root'
})
export class ProjektService {

  constructor(private http: HttpClient) { }

  getProjekt(id: string | null){
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa('admin:admin')
    });

    return this.http.get<ProjektWithTaskModel>(`http://localhost:8080/api/projekty/${id}`, { headers })
    .pipe(
      tap(response => console.log('Odpowiedź:', response)),
      catchError(error => {
        console.error('Błąd:', error);
        return throwError(error);
      })
    );
  }
}
