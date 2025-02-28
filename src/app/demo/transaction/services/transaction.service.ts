import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private baseUrl = 'http://localhost:8080/api';
  private http = inject(HttpClient);

  getCurrentAccounts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/current-accounts`);
  }

  createTransaction(transaction: any): Observable<any> {
    console.log('📤 Mock API Call:', transaction);
    return of({ message: 'Transaction saved successfully', data: transaction });
  }
  
  
}
