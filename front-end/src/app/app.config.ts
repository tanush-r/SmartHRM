import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment'; // Adjust the path if necessary
import { routes } from './app.routes';
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    // Firebase configuration
    provideFirebaseApp(() => initializeApp(environment.firebase)), // Initialize Firebase
    provideAuth(() => getAuth()) // Provide Firebase Authentication
  ]
};