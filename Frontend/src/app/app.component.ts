import {ChangeDetectionStrategy, Component, ViewChild} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {MatToolbar, MatToolbarRow} from "@angular/material/toolbar";
import {MatSidenav, MatSidenavContainer, MatSidenavContent, MatSidenavModule} from "@angular/material/sidenav";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatDivider} from "@angular/material/divider";
import {Subscription} from "rxjs";
import {StorageService} from "./Services/storage.service";
import {AuthService} from "./Services/auth.service";
import {BreakpointObserver} from "@angular/cdk/layout";
import {CommonModule, NgClass} from "@angular/common";

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { MatButtonModule } from '@angular/material/button';

import { ReactiveFormsModule } from '@angular/forms';
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    MatToolbar,
    MatIcon,
    MatSidenavContainer,
    MatSidenav,
    MatDivider,
    RouterOutlet,
    MatSidenavModule,
    CommonModule,
    NgClass,
    MatButtonModule,
    RouterLink,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatNativeDateModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Frontend';
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  private role: string = '';
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;
  name?: string;
  surname?: string;


  eventBusSub?: Subscription;

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private observer: BreakpointObserver,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();

    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      console.log('Pobrane dane użytkownika:', user);

      if (user) {
        this.role = user.role;
        this.username = user.username;
        this.name = user.name;
        this.surname = user.surname;

        this.showAdminBoard = this.role.includes('admin');
        this.showModeratorBoard = this.role.includes('ROLE_MODERATOR');
      } else {
        console.error('Nie udało się pobrać danych użytkownika.');
      }
    }


  }
  isAdmin() {
    return this.role === 'admin';
  }

  ngAfterViewInit(){
    this.observer.observe(['(max-width: 800px']).subscribe((res)=>{
      if(res.matches){
        this.sidenav.mode='over';
        this.sidenav.close();
      }
      else{
        this.sidenav.mode='side';
        this.sidenav.open();
      }
    });
  }
  logout(): void {
    this.storageService.logout();
    this.authService.logout().subscribe({
      next: res => {
        console.log(res);
        this.storageService.clean();

        this.isLoggedIn = false;
        this.showAdminBoard = false;
        this.showModeratorBoard = false;
        this.role = '';
        this.username = undefined;
        this.name = undefined;
        this.surname = undefined;



        this.router.navigate(['/login']);
      },
      error: err => {
        console.log(err);
      }
    });
  }
}
