import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private baseUrl = 'http://localhost:8080/api'; // ✅ Correct API base URL
  private http = inject(HttpClient);

  // ✅ Get all Current Accounts (Fix for missing CurrentAccount ID)
  getCurrentAccounts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/current-accounts`).pipe(
      catchError(error => {
        console.error('❌ Error fetching current accounts:', error);
        return throwError(() => new Error('Failed to load current accounts'));
      })
    );
  }

  // ✅ Get Transactions by Current Account ID
  getTransactionsByAccount(accountId: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/transactions/current-account/${accountId}?page=0&size=10&sortBy=transactionDate&sortDir=desc`
    ).pipe(
      catchError(error => {
        console.error('❌ Error fetching transactions:', error);
        return throwError(() => new Error('Failed to load transactions'));
      })
    );
  }

  // ✅ Create a Transaction
  createTransaction(transaction: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/transactions`, transaction).pipe(
      tap((response: { error?: string }) => {
        console.log('✅ Transaction successful:', response);
        if (response && response.error) {
          throw new Error(response.error);
        }
      }),
      catchError(error => {
        console.error('❌ Transaction creation failed:', error);
        return throwError(() => new Error('Failed to create transaction'));
      })
    );
  }
}
