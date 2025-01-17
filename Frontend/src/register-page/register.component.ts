import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../app/Services/auth.service";
import {StorageService} from "../app/Services/storage.service";
import {FormsModule} from "@angular/forms";
import {CommonModule, NgClass} from "@angular/common";
import {MatDivider} from "@angular/material/divider";
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    CommonModule,
    MatDivider
  ],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{
  form: any = {
    email: null,
    password: null,
    name: null,
    lastName: null,
    confirmPassword: null,
    indeks: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  isLoggedIn = false;
  isLoginFailed = false;
  role: string = '';

  constructor(private snackBar: MatSnackBar, private router: Router, private authService: AuthService, private storageService: StorageService) { }

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
    const { email, password, confirmPassword, name, lastName, indeks } = this.form;

    // Sprawdź, czy hasła są takie same
    if (password !== confirmPassword) {
      this.showNotification("Hasła nie są takie same!", "error");
      return;
    }

    this.authService.register(name, lastName, email, password, indeks).subscribe({
      next: (data) => {
        this.showNotification("Rejestracja zakończona sukcesem!", "success");
        this.navigateToLoginPage();
      },
      error: (err) => {
        const errorMessage = err.error.message || "Wystąpił błąd podczas rejestracji";
        this.showNotification(errorMessage, "error");
        console.error("Błąd podczas rejestracji:", err);
      },
    });
  }

  showNotification(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    this.snackBar.open(message, 'Zamknij', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: [`snackbar-${type}`],
    });
  }
  navigateToLoginPage(){
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }
}
