import { RouterModule, Routes } from '@angular/router';
import { ProjektListPageComponent } from '../projekt-list-page/projekt-list-page.component';
import { PrjektPageComponent } from '../projekt-page/prjekt-page.component';
import { NgModule } from '@angular/core';
import {LoginPageComponent} from "../login-page/login-page.component";
import {RegisterComponent} from "../register-page/register.component";

export const routes: Routes = [
    {path: "projekty", component: ProjektListPageComponent },
    {path: "projekt/:id", component: PrjektPageComponent},
    {path: "login", component: LoginPageComponent},
  {path: "register", component: RegisterComponent}

];
