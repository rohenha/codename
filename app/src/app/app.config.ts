import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideZard } from '@/shared/core/provider/providezard';
import { AuthService } from '@/auth/auth-service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => inject(AuthService).loadCurrentUser()),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideZard(),
  ]
};
