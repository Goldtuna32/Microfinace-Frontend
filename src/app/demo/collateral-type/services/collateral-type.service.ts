import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CollateralType } from '../models/collateralType.model';
import { Observable, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CollateralTypeService {
  private baseUrl = 'http://localhost:8080/api/collateral-types'; // Adjust if your backend URL differs

  constructor(private http: HttpClient) {}

  getAllActiveCollateralTypes(): Observable<CollateralType[]> {
    return this.http.get<CollateralType[]>(`${this.baseUrl}/active`).pipe(
      catchError(error => {
        console.error('Failed to fetch active collateral types:', error.statusText);
        return throwError(() => new Error(error.statusText));
      })
    );
  }

  getAllDeletedCollateralTypes(): Observable<CollateralType[]> {
    return this.http.get<CollateralType[]>(`${this.baseUrl}/deleted`).pipe(
      catchError(error => {
        console.error('Failed to fetch deleted collateral types:', error.statusText);
        return throwError(() => new Error(error.statusText));
      })
    );
  }
  
  softDeleteCollateralType(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Delete failed for ID ${id}:`, error.statusText);
        return throwError(() => new Error(error.statusText));
      })
    );
  }
  
  restoreCollateralType(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/restore`, {}).pipe(
      catchError(error => {
        console.error(`Restore failed for ID ${id}:`, error.statusText);
        return throwError(() => new Error(error.statusText));
      })
    );
  }
  // Get a single collateral type by ID
  getCollateralTypeById(id: number): Observable<CollateralType> {
    return this.http.get<CollateralType>(`${this.baseUrl}/${id}`);
  }

  createCollateralType(dto: CollateralType): Observable<CollateralType> {
    return this.http.post<CollateralType>(`${this.baseUrl}/create`, dto).pipe(
      catchError(error => {
        console.error('Failed to create collateral type:', error.statusText);
        return throwError(() => new Error(error.statusText));
      })
    );
  }

  // Update an existing collateral type
  updateCollateralType(id: number, collateralType: CollateralType): Observable<CollateralType> {
    return this.http.put<CollateralType>(`${this.baseUrl}/${id}`, collateralType);
  }

}
