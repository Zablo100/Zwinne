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

  getProjekt(){
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa('admin:admin')
    });

    return this.http.get<PageableResponse<ProjektModel[]>>('http://localhost:8080/api/projekty?page=0&size=10&sort=nazwa', { headers })
    .pipe(
      tap(response => console.log('Odpowiedź:', response)),
      catchError(error => {
        console.error('Błąd:', error);
        return throwError(error);
      })
    );
  }
}
