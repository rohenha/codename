import { ApplicationConfig, importProvidersFrom, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { routes } from './app.routes';
import { provideZard } from '@/shared/core/provider/providezard';
import { AuthService } from '@/auth/auth-service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '@/auth/auth-interceptor';
import { NgIconsModule } from '@ng-icons/core';
import { lucideUser, lucideUserStar } from '@ng-icons/lucide';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => firstValueFrom(inject(AuthService).loadCurrentUser())),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideZard(),
    importProvidersFrom(NgIconsModule.withIcons({ lucideUserStar, lucideUser }))
  ]
};
