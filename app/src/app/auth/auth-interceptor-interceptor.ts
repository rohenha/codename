import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token')

  const authReq = token
    ? req.clone({
        withCredentials: true,
        setHeaders: { 'X-Player-Token': token },
      })
    : req.clone({ withCredentials: true })

  return next(authReq)
}
