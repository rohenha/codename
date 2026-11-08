import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth-service';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)
  return true
  // return true;
  //   const authService = inject(AuthService)
  // const router = inject(Router)
  // if (authService.currentUser()) {
  //   return true
  // }

  // return router.createUrlTree(['/auth'])
};
