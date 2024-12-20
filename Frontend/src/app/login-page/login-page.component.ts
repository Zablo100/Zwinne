import {Component, OnInit} from '@angular/core';
import { AuthService } from '../auth.service';
import { StorageService } from '../storage.service';
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
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService)
  { }
  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
    }
  }
  onSubmit(): void {
    const { username, password } = this.form;

    this.authService.login(username, password).subscribe({
      next: data => {
        this.storageService.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.storageService.getUser().roles;
        this.reloadPage();

      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }



}
