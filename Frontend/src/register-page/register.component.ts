import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../app/Services/auth.service";
import {StorageService} from "../app/Services/storage.service";
import {FormsModule} from "@angular/forms";
import {CommonModule, NgClass} from "@angular/common";
import {MatDivider} from "@angular/material/divider";

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

  constructor(private router: Router, private authService: AuthService, private storageService: StorageService) { }

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
    alert(email);
    this.authService.register(name, lastName, email, password, indeks).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.navigateToLoginPage();

      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
        alert(this.isSignUpFailed);

      }
    });


  }
  navigateToLoginPage(){
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }
}
