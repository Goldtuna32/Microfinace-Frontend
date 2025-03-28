import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';


interface DashboardSummary {
  totalCifs: number;
  activeCifs: number;
  totalSmeLoans: number;
  pendingSmeLoans: number;
  totalHpRegistrations: number;
  activeHpRegistrations: number;
  totalCollateralValue: number;
  avgCollateralPerLoan: number;
}

interface LoanStatusDistribution {
  approved: number;
  pending: number;
  rejected: number;
}

interface MonthlyApplications {
  smeLoans: number[];
  hpRegistrations: number[];
}

interface RecentLoan {
  serialCode: string;
  customerName: string;
  loanAmount: number;
  status: number;
  applicationDate: string;
}

interface HpProductDistribution {
  productTypes: string[];
  counts: number[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:8080/api/dashboard';

  constructor(private http: HttpClient) { }

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.apiUrl}/summary`);
  }

  getLoanStatusDistribution(): Observable<LoanStatusDistribution> {
    return this.http.get<LoanStatusDistribution>(`${this.apiUrl}/loan-status-distribution`);
  }

  getMonthlyApplications(): Observable<MonthlyApplications> {
    return this.http.get<MonthlyApplications>(`${this.apiUrl}/monthly-applications`);
  }

  getRecentLoans(): Observable<RecentLoan[]> {
    return this.http.get<RecentLoan[]>(`${this.apiUrl}/recent-loans`).pipe(
      map(loans => loans.map(loan => ({
        ...loan,
        applicationDate: new Date(loan.applicationDate).toLocaleDateString()
      })))
    );
  }

  getHpProductDistribution(): Observable<HpProductDistribution> {
    return this.http.get<HpProductDistribution>(`${this.apiUrl}/hp-product-distribution`);
  }
}
