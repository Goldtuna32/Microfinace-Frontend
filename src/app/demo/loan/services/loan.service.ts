import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private baseUrl = 'http://localhost:8080/api/loans'; // Adjust as needed

  constructor(private http: HttpClient) {}

  getLoans(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  createLoan(loanData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, loanData);
  }
}