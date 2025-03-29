import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    if (!this.auth.isAuthenticated()) {
      // If not authenticated at all, redirect to login
      this.router.navigate(['/auth/signin']);
      return of(false);
    }

    // If token is expired, try to refresh
    if (this.auth.isAccessTokenExpired()) {
      return this.auth.refreshToken().pipe(
        map(() => true),
        catchError(() => {
          this.router.navigate(['/auth/signin']);
          return of(false);
        })
      );
    }

    return of(true);
  }
}