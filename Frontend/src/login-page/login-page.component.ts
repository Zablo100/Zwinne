import {Component, OnInit} from '@angular/core';
import { AuthService } from '../app/Services/auth.service';
import { StorageService } from '../app/Services/storage.service';
import { Router } from '@angular/router';
import {CommonModule, NgClass} from "@angular/common";
import {FormsModule} from "@angular/forms";
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    NgClass,
    FormsModule,
    CommonModule,
    MatToolbarModule,
    MatButtonModule

  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit{
  form: any = {
    email: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  role: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService)
  { }
  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      const user = this.storageService.getUser();
      if (user) {
        this.role = user.role;
      } else {
        console.error('Nie udało się pobrać danych użytkownika.');
      }
    }
  }
  onSubmit(): void {
    const { email, password } = this.form;

    this.authService.login(email, password).subscribe({
      next: data => {
        console.log('Response from server:', data);

        this.storageService.saveUser(data);

        // Zapis studentId
        if (data.studentId) {
          this.storageService.saveStudentId(data.studentId);
          console.log('Zapisano studentId:', data.studentId);
        } else {
          console.warn('Brak studentId w odpowiedzi z serwera.');
        }

        this.isLoginFailed = false;
        this.isLoggedIn = true;

        this.router.navigate(['/projekty']).then(() => {
          window.location.reload();
        });
      },
      error: err => {
        console.error('Error from server:', err);
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });
  }


  reloadPage(): void {
    window.location.reload();
  }



}
