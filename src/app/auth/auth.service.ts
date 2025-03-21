import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private loginUrl = 'http://localhost:8080/api/auth/login'; // Backend URL
  private refreshTokenUrl = 'http://localhost:8080/api/auth/refresh-token'; // Backend refresh-token URL
  private logoutUrl = 'http://localhost:8080/api/auth/logout'; // Backend logout URL
  private checkAuthUrl = 'http://localhost:8080/api/auth/check-auth'; // Backend check-auth URL

  constructor(private http: HttpClient) {}

  // Login request
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(this.loginUrl, credentials, { withCredentials: true }).pipe(
      catchError(error => {
        console.error('Login error:', error);
        throw error; // Rethrow error for further handling if necessary
      })
    );
  }

  // Refresh token request
  refreshToken(): Observable<any> {
    return this.http.post(this.refreshTokenUrl, {}, { withCredentials: true }).pipe(
      catchError(error => {
        console.error('Refresh token error:', error);
        console.log('Refresh token error:', error);
        throw error; // Rethrow error for further handling if necessary
      })
    );
  }

  // Logout request
  logout(): void {
    this.http.post(this.logoutUrl, {}, { withCredentials: true }).subscribe(() => {
      window.location.href = '/auth/signin'; // Redirect to login page
    });
  }

  // Check if user is authenticated
  isAuthenticated(): Observable<boolean> {
    return this.http.get<boolean>(this.checkAuthUrl, { withCredentials: true }).pipe(
      catchError(error => {
        console.error('Authentication check error:', error);
        return new Observable<boolean>((observer) => observer.next(false)); // Return false if error occurs
      })
    );
  }
}
