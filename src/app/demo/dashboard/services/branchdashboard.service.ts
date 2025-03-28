import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface BranchDashboardStats {
  branchId: number;
  branchName: string;
  cifCount: number;
  activeCifCount: number;
  currentAccountCount: number;
  collateralCount: number;
  smeLoanCount: number;
  pendingSmeLoanCount: number;
  activeSmeLoanCount: number;
  transactionCount: number;
  hpProductCount: number;
  hpRegistrationCount: number;
  activeHpRegistrationCount: number;
  dealerRegistrationCount: number;
} 

export interface BranchComparisonStats {
  branchId: number;
  branchName: string;
  cifCount: number;
  activeCifCount: number;
  smeLoanCount: number;
  hpRegistrationCount: number;
}


@Injectable({
  providedIn: 'root'
})
export class BranchdashboardService {
  private apiUrl = 'http://localhost:8080/api/branch-dashboard';

  constructor(private http: HttpClient) { }

  getBranchStats(): Observable<BranchDashboardStats> {
    return this.http.get<BranchDashboardStats>(this.apiUrl);
  }

  getAllBranchesComparison(): Observable<BranchComparisonStats[]> {
    return this.http.get<BranchComparisonStats[]>(`${this.apiUrl}/all`);
  }
}
