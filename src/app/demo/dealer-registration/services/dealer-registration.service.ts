import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DealerRegistrationService {
  getDealerById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

 

  private baseUrl = 'http://localhost:8080/api/dealer-registration';


  constructor(private http: HttpClient) { }

  getCurrentAccounts(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/current-accounts');
  }

  // Create a new dealer
  createDealer(dealerData: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, dealerData);
  }

  getAllDealers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }

  updateDealer(id: number, dealerData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, dealerData);
  }
  

  deleteDealer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

}
