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

  isStudentAssignedToProject(projektId: number, studentId: number): Observable<boolean> {
    const headers = this.getAuthHeaders(); // Użycie nagłówków uwierzytelniających
    return this.http.get<boolean>(
      `http://localhost:8080/api/projekty/${projektId}/isAssigned?studentId=${studentId}`,
      { headers }
    );
  }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: 'Basic ' + btoa('admin:admin'), // Zamień dane logowania na dynamiczne, jeśli potrzebne
    });
  }


  downloadFile(fileName: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa('admin:admin')
    });

    return this.http.get(`${this.baseUrl}/files/${fileName}`, { headers, responseType: 'blob' });
  }

  addTaskToProjekt(request: any){
    console.log("Tak")
    console.log(request)
    const headers = this.getAuthHeaders();
    return this.http.post<any>('http://localhost:8080/api/zadania', request, { headers }).pipe(
      catchError((error) => {
        console.error('Błąd podczas dodawania projektu:', error);
        return throwError(error);
      })
    );
  }

}
