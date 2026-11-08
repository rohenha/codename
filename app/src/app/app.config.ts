import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { routes } from './app.routes';
import { provideZard } from '@/shared/core/provider/providezard';
import { AuthService } from '@/auth/auth-service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptorInterceptor } from '@/auth/auth-interceptor-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => firstValueFrom(inject(AuthService).loadCurrentUser())),
    provideHttpClient(withInterceptors([authInterceptorInterceptor])),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideZard(),
  ]
};
