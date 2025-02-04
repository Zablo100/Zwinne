import { RouterModule, Routes } from '@angular/router';
import { ProjektListPageComponent } from '../projekt-list-page/projekt-list-page.component';
import { PrjektPageComponent } from '../projekt-page/prjekt-page.component';
import { NgModule } from '@angular/core';
import {LoginPageComponent} from "../login-page/login-page.component";
import {RegisterComponent} from "../register-page/register.component";
import { AuthGuard } from './guard';
import {UsersListPageComponent} from "../users-list-page/users-list-page.component";
import {ProjektListYourComponent} from "../projekt-list-your/projekt-list-your.component";
import {ContactComponent} from "../contact/contact.component";
import {ProjektChatComponent} from "../projekt-chat/projekt-chat.component";
export const routes: Routes = [
  {path: "projekty", component: ProjektListPageComponent, canActivate: [AuthGuard] },
  {path: "projekt/:id", component: PrjektPageComponent, canActivate: [AuthGuard]},
  { path: 'twojeProjekty', component: ProjektListYourComponent, canActivate: [AuthGuard] },
  {path: "login", component: LoginPageComponent},
  {path: "kontakt", component: ContactComponent},
  {path: "register", component: RegisterComponent},
  { path: 'chat', component: ProjektChatComponent },
  {path: "users", component: UsersListPageComponent, canActivate: [AuthGuard]}
];
