import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProjektWithTaskModel } from '../app/Models/Projekt';
import {catchError, Observable, tap, throwError} from 'rxjs';
import { PageableResponse } from '../app/Models/Pageable';

@Injectable({
  providedIn: 'root'
})
export class ProjektService {
  private baseUrl = 'http://localhost:8080/file/api'; // URL do Twojego API (zmień, jeśli potrzebujesz)

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
  downloadFile(fileName: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa('admin:admin') // Dodaj nagłówki uwierzytelniania
    });

    return this.http.get(`${this.baseUrl}/files/${fileName}`, { headers, responseType: 'blob' });
  }

}
