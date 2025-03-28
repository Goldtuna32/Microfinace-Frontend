import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Branch } from '../models/branch.model';
import { map } from 'rxjs/operators';

export interface PageResponse<T> {
  content: T[];
  page: PageInfo;
}
export interface PageInfo {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  private baseUrl = 'http://localhost:8080/api/branches';  

  constructor(private http: HttpClient) { }

  // Get all branches
  getBranches(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  getBranchDetails(branchId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${branchId}/details`);
  }

  // Create a new branch
  createBranch(branchData: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, branchData);
  }

  updateBranch(id: number, branchData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, branchData);
  }

  // ✅ Delete a branch by ID
  deleteBranch(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getBranchById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

 getBranchesWith(page: number, size: number, filters: { region?: string; branchName?: string; branchCode?: string } = {}): Observable<PageResponse<Branch>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters.region) params = params.set('region', filters.region);
    if (filters.branchName) params = params.set('name', filters.branchName);
    if (filters.branchCode) params = params.set('branchCode', filters.branchCode);

    const url = `${this.baseUrl}/paged`;
    return this.http.get<PageResponse<Branch>>(url, { params });
  }

  checkDuplicate(branchData: Partial<Branch>): Observable<boolean> {
    return this.getBranches().pipe(
      map((branches: Branch[]) => {
        return branches.some(existingBranch => {
          return (
            existingBranch.branchName === branchData.branchName ||
            existingBranch.phoneNumber === branchData.phoneNumber ||
            existingBranch.email === branchData.email
          );
        });
      })
    );
  }

}
