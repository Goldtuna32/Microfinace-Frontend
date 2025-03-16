import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service'; // Import AuthService
import { Router } from '@angular/router'; // Import Router to redirect to sign-in

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let accessToken = this.authService.getAccessToken();
  
    if (accessToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
          
        }
      });
    }
    console.log('Access Token:', accessToken);

  
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Access token is expired or invalid
          return this.authService.refreshTokenRequest().pipe(
            switchMap((authResponse) => {
              if (authResponse && authResponse.accessToken) {
                // Store the new tokens
                this.authService.storeTokens(authResponse);
  
                // Retry the original request with the new access token
                req = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${authResponse.accessToken}`
                  }
                });
  
                return next.handle(req);
              } else {
                // If the refresh token is also invalid, log the user out
                this.authService.logout();
                this.router.navigate(['/sign-in']); // Redirect to sign-in page
                return throwError(() => new Error('Refresh token failed')); // Throw the error to stop the request
              }
            }),
            catchError((refreshError) => {
              // If refresh token request fails, log the user out
              this.authService.logout();
              this.router.navigate(['/sign-in']); // Redirect to sign-in page
              return throwError(() => refreshError); // Throw the error to stop the request
            })
          );
        }
  
        return throwError(() => error); // If error is not 401, just throw the error
      })
    );
  }
}