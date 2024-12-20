import { RouterModule, Routes } from '@angular/router';
import { ProjektListPageComponent } from '../projekt-list-page/projekt-list-page.component';
import { PrjektPageComponent } from '../prjekt-page/prjekt-page.component';
import { NgModule } from '@angular/core';
import {LoginPageComponent} from "./login-page/login-page.component";

export const routes: Routes = [
    {path: "projekty", component: ProjektListPageComponent },
    {path: "projekt/:id", component: PrjektPageComponent},
    {path: "login", component: LoginPageComponent}
];
