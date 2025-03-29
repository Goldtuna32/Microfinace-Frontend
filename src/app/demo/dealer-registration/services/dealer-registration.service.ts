import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DealerRegistration } from '../../hp-product/services/hp-product.service';

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

  getAllActiveDealers(branchId?: number): Observable<DealerRegistration[]> {
    let params = new HttpParams();
    if (branchId !== undefined) {
      params = params.set('branchId', branchId.toString());
    }
    return this.http.get<DealerRegistration[]>(`${this.baseUrl}/activeDealers`, { params });
  }

  getAllInactiveDealers(branchId?: number): Observable<DealerRegistration[]> {
    let params = new HttpParams();
    if (branchId !== undefined) {
      params = params.set('branchId', branchId.toString());
    }
    return this.http.get<DealerRegistration[]>(`${this.baseUrl}/InactiveDealers`, { params });
  }

}
