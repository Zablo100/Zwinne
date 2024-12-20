import {Component, ViewChild} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {MatToolbar, MatToolbarRow} from "@angular/material/toolbar";
import {MatSidenav, MatSidenavContainer, MatSidenavContent, MatSidenavModule} from "@angular/material/sidenav";
import {MatIcon} from "@angular/material/icon";
import {MatDivider} from "@angular/material/divider";
import {Subscription} from "rxjs";
import {StorageService} from "./Services/storage.service";
import {AuthService} from "./Services/auth.service";
import {BreakpointObserver} from "@angular/cdk/layout";
import {CommonModule, NgClass} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";

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
    RouterLink
  ],
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Frontend';
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;

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
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.username = user.username;
    }


  }
  isAdmin(){
    if(this.roles.includes("ROLE_ADMIN")){
      return true;
    }
    else{
      return false;
    }
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
    this.authService.logout().subscribe({
      next: res => {
        console.log(res);
        this.storageService.clean();

        window.location.reload();
      },
      error: err => {
        console.log(err);
      }
    });
  }
}
