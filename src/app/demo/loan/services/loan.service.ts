import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { LoanRegistrationRequest } from '../models/LoanRegistrationRequest.model';
import { SmeLoanRegistration } from '../models/SmeLoanRegistration.model';
import { SmeLoanCollateral } from '../models/SmeLoanCollateral.model';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private baseUrl = 'http://localhost:8080/api/loans';
  private collateralApiUrl = 'http://localhost:8080/api/collaterals';
  //  // Adjust as needed

  constructor(private http: HttpClient) {}

  getLoans(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  createLoan(loanData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, loanData);
  }

  registerLoan(request: LoanRegistrationRequest): Observable<SmeLoanRegistration> {
    return this.http.post<SmeLoanRegistration>(`${this.baseUrl}/register`, request).pipe(
      catchError(error => {
        console.error('Failed to register loan:', error);
        return throwError(() => new Error(error.statusText));
      })
    );
  }

  getPendingLoans(): Observable<SmeLoanRegistration[]> {
    return this.http.get<SmeLoanRegistration[]>(`${this.baseUrl}/pending`);
  }

  getApprovedLoans(): Observable<SmeLoanRegistration[]> {
    return this.http.get<SmeLoanRegistration[]>(`${this.baseUrl}/approved`);
  }

  approveLoan(id: number): Observable<SmeLoanRegistration> {
    return this.http.post<SmeLoanRegistration>(`${this.baseUrl}/${id}/approve`, {});
  }

  getLoanById(id: number): Observable<SmeLoanRegistration> {
    return this.http.get<SmeLoanRegistration>(`${this.baseUrl}/${id}`);
  }

  getCollateralsByCifId(cifId: number): Observable<SmeLoanCollateral[]> {
    return this.http.get<SmeLoanCollateral[]>(`${this.collateralApiUrl}/cif/${cifId}`);
  }

  updateLoan(id: number, dto: SmeLoanRegistration): Observable<SmeLoanRegistration> {
    return this.http.put<SmeLoanRegistration>(`${this.baseUrl}/${id}`, dto);
  }

  getCollateralsByLoanId(loanId: number): Observable<SmeLoanCollateral[]> {
    return this.http.get<SmeLoanCollateral[]>(`${this.collateralApiUrl}/loan/${loanId}`);
  }
}