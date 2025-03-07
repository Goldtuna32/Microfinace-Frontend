import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RepaymentSchedule } from '../models/RepaymentSchedule.model';

@Injectable({
  providedIn: 'root'
})
export class RepaymentScheduleService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getRepaymentSchedule(loanId: number): Observable<RepaymentSchedule[]> {
    return this.http.get<RepaymentSchedule[]>(`${this.apiUrl}/repayment-schedule/${loanId}`);
  }

  exportReport(loanId: number, format: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/reports/repayment-schedule/${loanId}?format=${format}`, {
      responseType: 'blob'
    });
  }
}
