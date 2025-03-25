import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { BehaviorSubject, throwError, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private accessTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(
      `${this.apiUrl}/login`, 
      { email, password },
      { withCredentials: true }
    ).pipe(
      tap(res => this.setAccessToken(res.accessToken))
    );
  }

  refreshToken(): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(
      `${this.apiUrl}/refresh`,
      {},
      { withCredentials: true }
    ).pipe(
      tap(res => this.setAccessToken(res.accessToken)),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .subscribe({
        complete: () => this.clearSession(),
        error: () => this.clearSession()
      });
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken() && !this.isAccessTokenExpired();
  }

  private setAccessToken(token: string): void {
    sessionStorage.setItem('accessToken', token);
    this.accessTokenSubject.next(token);
  }

  private clearSession(): void {
    sessionStorage.removeItem('accessToken');
    this.accessTokenSubject.next(null);
    this.router.navigate(['/auth/signin']);
  }

  isAccessTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;
    
    try {
      const expiry = JSON.parse(atob(token.split('.')[1])).exp;
      return Math.floor(Date.now() / 1000) >= expiry;
    } catch {
      return true;
    }
  }
}