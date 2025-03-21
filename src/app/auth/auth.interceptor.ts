import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);

  // Clone the request, allowing credentials (cookies) to be sent
  const clonedReq = req.clone({
    withCredentials: true // This ensures cookies are sent
  });

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('[AuthInterceptor] Error caught:', error);

      if (error.status === 401) {
        console.log('[AuthInterceptor] Token expired, attempting refresh...');

        return authService.refreshToken().pipe(
          switchMap(() => {
            console.log('[AuthInterceptor] Retrying original request...');
            return next(clonedReq);
          }),
          catchError(refreshError => {
            console.error('[AuthInterceptor] Refresh failed:', refreshError);
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
