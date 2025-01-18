import { Injectable } from '@angular/core';

const USER_KEY = 'auth-user';

export interface user {
  role: string;
  username: string;
  name: string;
  surname: string;


}

const STUDENT_ID_KEY = 'student-id';
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() {}

  clean(): void {
    window.sessionStorage.clear();
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): user | null {
    const user = window.sessionStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  public getRole(): string | null {
    const user = this.getUser();
    return user ? user.role : null;
  }

  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }
    return false;
  }

  public logout(): void {
    window.sessionStorage.removeItem(USER_KEY);
  }

  public saveStudentId(studentId: number): void {
    window.sessionStorage.setItem(STUDENT_ID_KEY, studentId.toString());
  }

  public getStudentId(): number | null {
    const studentId = window.sessionStorage.getItem(STUDENT_ID_KEY);
    return studentId ? Number(studentId) : null;
  }

  public clearStorage(): void {
    window.sessionStorage.clear();
  }

}
