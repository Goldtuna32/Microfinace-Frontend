import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthResponse } from 'src/app/models/auth-response.model'; // Your AuthResponse model

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private accessToken: string | null = null;  // Access token stored in memory
  private refreshToken: string | null = null; // Refresh token in HTTP-only cookie

  private readonly apiUrl = 'http://localhost:8080/api/auth'; // Your API URL

  private loggedIn = new BehaviorSubject<boolean>(false); // Observable to manage login status
  public loggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {}

  // Login method
  login(credentials: { email: string, password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials);
  }

  // Method to refresh the access token using the refresh token stored in the cookie
  refreshTokenRequest(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`, {}, { withCredentials: true });
  }

  // Store the tokens in memory and cookies
  storeTokens(authResponse: AuthResponse): void {
    this.accessToken = authResponse.accessToken;
    this.refreshToken = authResponse.refreshToken;
    this.loggedIn.next(true); // User is logged in
  }

  // Logout method
  logout(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.loggedIn.next(false); // User is logged out
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe();
  }

  // Get the access token
  getAccessToken(): string | null {
    return this.accessToken;
  }
}
