import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProjektModalAdminService {
  private readonly BASE_URL = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: 'Basic ' + btoa('admin:admin'),
    });
  }

  getProjektById(projektId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.BASE_URL}/projekty/${projektId}`, { headers }).pipe(
      catchError((error) => {
        console.error('Błąd podczas pobierania szczegółów projektu:', error);
        return throwError(error);
      })
    );
  }

  getStudents(): Observable<any> {
    const headers = this.getAuthHeaders();

    return this.http
      .get<any>(`${this.BASE_URL}/students`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Błąd podczas pobierania studentów:', error);
          return throwError(error);
        })
      );
  }


  assignStudentToProjekt(projektId: number, studentId: number): Observable<void> {
    const headers = this.getAuthHeaders();

    return this.http
      .post<void>(
        `${this.BASE_URL}/projekt/${projektId}/studenci/${studentId}`,
        {},
        { headers }
      )
      .pipe(
        catchError((error) => {
          console.error(
            `Błąd podczas przypisywania studenta ${studentId} do projektu ${projektId}:`,
            error
          );
          return throwError(error);
        })
      );
  }

  removeStudentFromProject(projektId: number, studentId: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http
      .delete<void>(`${this.BASE_URL}/projekt/${projektId}/studenci/${studentId}`, { headers })
      .pipe(
        catchError((error) => {
          console.error(`Błąd podczas usuwania studenta ${studentId} z projektu ${projektId}:`, error);
          return throwError(error);
        })
      );
  }

  deleteProject(projektId: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.BASE_URL}/projekty/${projektId}`, { headers }).pipe(
      catchError((error) => {
        console.error(`Błąd podczas usuwania projektu o ID ${projektId}:`, error);
        return throwError(error);
      })
    );
  }
}
