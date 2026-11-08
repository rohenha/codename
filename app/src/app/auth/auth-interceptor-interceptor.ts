import {
  HttpContextToken,
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth-service';

const AUTH_RETRY = new HttpContextToken<boolean>(() => false)

function isAuthEndpoint(url: string) {
  return url.includes('/auth/refresh') || url.includes('/auth/logout')
}

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService)

  // The tokens live in HttpOnly cookies: Angular only has to send credentials.
  const authReq = req.clone({ withCredentials: true })

  return next(authReq).pipe(
    catchError((error: unknown) => {
      const isUnauthorized = error instanceof HttpErrorResponse && error.status === 401
      const alreadyRetried = authReq.context.get(AUTH_RETRY)

      if (!isUnauthorized || alreadyRetried || isAuthEndpoint(authReq.url)) {
        return throwError(() => error)
      }

      return authService.refresh().pipe(
        switchMap(() =>
          next(
            req.clone({
              withCredentials: true,
              context: req.context.set(AUTH_RETRY, true),
            })
          )
        )
      )
    })
  )
}
