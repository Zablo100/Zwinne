import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { StudentModel } from '../Models/Student';
import { PageableResponse } from '../Models/Pageable';
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private readonly BASE_URL = 'http://localhost:8080/api/students';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Basic ' + btoa('admin:admin'),
    });
  }

  // Pobieranie użytkowników (stronicowanie)
  getStudents(pageIndex: number, pageSize: number): Observable<PageableResponse<StudentModel[]>> {
    const headers = this.getAuthHeaders();
    const params = {
      page: pageIndex.toString(),
      size: pageSize.toString(),
    };

    return this.http.get<PageableResponse<StudentModel[]>>(this.BASE_URL, { headers, params });
  }

  deleteStudent(studentId: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.BASE_URL}/${studentId}`, { headers }).pipe(
      catchError((error) => {
        if (error.status === 400) {
          alert('Nie można usunąć studenta, ponieważ jest przypisany do projektów.');
        } else {
          console.error(`Błąd podczas usuwania studenta o ID ${studentId}:`, error);
        }
        return throwError(error);
      })
    );
  }


}
