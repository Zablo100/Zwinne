import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideHttpClient} from "@angular/common/http";
import {provideRouter} from "@angular/router";
import {importProvidersFrom} from "@angular/core";
import {MatNativeDateModule} from "@angular/material/core";
import {routes} from "./app/app.routes";

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideRouter(routes),
    importProvidersFrom(MatNativeDateModule), // here
  ],
});
