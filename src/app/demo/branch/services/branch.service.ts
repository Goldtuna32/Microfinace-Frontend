import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Branch } from '../models/branch.model';
import { map } from 'rxjs/operators';

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

  getBranchesWith(): Observable<Branch[]> {
    return this.http.get<any>(`${this.baseUrl}/paged`).pipe(
        map(response => response.content) // ✅ Extract only the branch list
    );
}

}
