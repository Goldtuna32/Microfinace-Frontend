import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { LoanRegistrationRequest } from '../models/LoanRegistrationRequest.model';
import { SmeLoanRegistration } from '../models/SmeLoanRegistration.model';
import { SmeLoanCollateral } from '../models/SmeLoanCollateral.model';
import { CIF } from '../../cif/models/cif.model';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private baseUrl = 'http://localhost:8080/api/loans';
  private baseUrl1 = 'http://localhost:8080/api';
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
    return this.http.get<any>(`${this.baseUrl}/pending`).pipe(
      map((page) => {
        console.log('Pending Loans Response:', page);
        return page.content || []; // Extract content array
      })
    );
  }

  getCifByCurrentAccountId(currentAccountId: number): Observable<CIF> {
    return this.http.get<CIF>(`${this.baseUrl1}/cif/current-account/${currentAccountId}`).pipe(
      map((cif) => {
        console.log('CIF Data:', cif);
        return cif;
      })
    );
  }

  getApprovedLoans(): Observable<SmeLoanRegistration[]> {
    return this.http.get<any>(`${this.baseUrl}/approved`).pipe(
      map((page) => {
        console.log('Approved Loans Response:', page);
        return page.content || []; // Extract content array
      })
    );
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

  getLoanDetails(loanId: string): Observable<SmeLoanRegistration> {
    return this.http.get<SmeLoanRegistration>(`${this.baseUrl}/${loanId}`);
  }

  downloadLoanPdfReport(loanId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl1}/reports/loan/detail/${loanId}/pdf`, {
      responseType: 'blob'
    });
  }

  downloadLoanExcelReport(loanId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl1}/reports/loan/detail/${loanId}/excel`, {
      responseType: 'blob'
    });
  }

 // In your LoanService
getAllPendingLoans(branchId?: number): Observable<SmeLoanRegistration[]> {
  return this.http.get<SmeLoanRegistration[]>(`${this.baseUrl}/pendingLoans`, {
    params: branchId ? { branchId: branchId.toString() } : {}
  });
}

getAllApprovedLoans(branchId?: number): Observable<SmeLoanRegistration[]> {
  return this.http.get<SmeLoanRegistration[]>(`${this.baseUrl}/approvedLoans`, {
    params: branchId ? { branchId: branchId.toString() } : {}
  });
}

}