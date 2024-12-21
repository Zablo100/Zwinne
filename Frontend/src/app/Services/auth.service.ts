import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true,

};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signin',
      {
        username,
        password,

      },

      httpOptions
    );
  }

  getJwtToken(): string | null {
    const cookies = document.cookie.split(';');
    const jwtCookie = cookies.find((cookie) => cookie.trim().startsWith('jwtCookie'));

    if (jwtCookie) {
      return jwtCookie.trim().substring('jwtCookie='.length);
    }

    return null;
  }

  register(name: string, lastName: string, email: string, password: string, indeks: string): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      name,
      lastName,
      email,
      password,
      indeks
    }, httpOptions);
  }



  logout(): Observable<any> {
    return this.http.post(AUTH_API + 'signout', { }, httpOptions);
  }

  getJwtCookie(): string | null {
    const cookies = document.cookie.split(';');
    const jwtCookie = cookies.find((cookie) => cookie.trim().startsWith('jwtCookie'));

    if (jwtCookie) {
      return jwtCookie.trim().substring('jwtCookie'.length);
    }

    return null;
  }

}
