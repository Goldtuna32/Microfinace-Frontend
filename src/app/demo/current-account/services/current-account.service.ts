import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrentAccount } from '../components/current-account-list/current-account-list.component';

@Injectable({
  providedIn: 'root'
})
export class CurrentAccountService {
  private baseUrl = 'http://localhost:8080/api/current-accounts';

  constructor(private http: HttpClient) {}

  getAllCurrentAccounts(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getAllCurrentAccountByBranch(branchId?: number): Observable<CurrentAccount[]> {
    let params = new HttpParams();
    if (branchId !== undefined && branchId !== null) {
      params = params.set('branchId', branchId.toString());
    }
    
    return this.http.get<CurrentAccount[]>(`${this.baseUrl}/activeCurrentAccount`, { params });
  }

  getFreezeCurrentAccountByBranch(branchId?: number): Observable<CurrentAccount[]> {
    let params = new HttpParams();
    if (branchId !== undefined && branchId !== null) {
      params = params.set('branchId', branchId.toString());
    }

    return this.http.get<CurrentAccount[]>(`${this.baseUrl}/freezeCurrentAccount`, { params });
  }

  getCurrentAccountById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createCurrentAccount(accountData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, accountData);
  }

  deleteCurrentAccount(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }


  hasCurrentAccount(cifId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/exists/${cifId}`);
  }
  
  updateCurrentAccount(accountData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${accountData.id}`, accountData);
  }
  
}
