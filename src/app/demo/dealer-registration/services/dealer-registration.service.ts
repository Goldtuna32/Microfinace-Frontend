import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DealerRegistrationService {

  private baseUrl = 'http://localhost:8080/api/dealer-registration';


  constructor(private http: HttpClient) { }

  getCurrentAccounts(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/current-accounts');
  }

  // Create a new dealer
  createDealer(dealerData: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, dealerData);
  }
}
