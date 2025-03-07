import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Collateral } from '../models/collateral.model';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CollateralType } from '../../collateral-type/models/collateralType.model';
import { SmeLoanCollateral } from '../../loan/models/SmeLoanCollateral.model';

  
interface CurrentAccountDTO {
  id: number;
  accountNumber: string;
  cifId: number;
}

@Injectable({
  providedIn: 'root'
})
export class CollateralService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  createCollateral(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/collaterals`, formData);
  }

  getAllCollaterals(): Observable<Collateral[]> {
    return this.http.get<Collateral[]>(`${this.baseUrl}/collaterals/active`);
  }

  getAllActiveCollateralTypes(): Observable<CollateralType[]> {
    return this.http.get<CollateralType[]>(`${this.baseUrl}/collateral-types/active`).pipe(
      catchError(error => {
        console.error('Failed to fetch active collateral types:', error.statusText);
        return throwError(() => new Error(error.statusText));
      })
    );
  }

  getAllCollateralsForCif(cifId: number): Observable<SmeLoanCollateral[]> {
    return this.http.get<SmeLoanCollateral[]>(`${this.baseUrl}/collaterals/cif/${cifId}`);
  }

  getAllCifs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/cifs/active`).pipe( // Adjust endpoint as needed
      catchError(error => {
        console.error('Failed to fetch CIFs:', error.statusText);
        return throwError(() => new Error(error.statusText));
      })
    );
  }

  updateCollateral(id: number, formData: FormData): Observable<Collateral> {
    return this.http.put<Collateral>(`${this.baseUrl}/collaterals/${id}`, formData);
  }

  deleteCollateral(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/collaterals/${id}`);
  }

  restoreCollateral(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/collaterals/${id}/restore`, {}).pipe(
      catchError(error => {
        if (error.status === 404) {
          console.error(`Collateral with ID ${id} not found`);
        } else {
          console.error('Restore failed:', error.statusText);
        }
        return throwError(() => new Error(error.statusText));
      })
    );
  }

  getDeletedCollaterals(): Observable<Collateral[]> {
    return this.http.get<Collateral[]>(`${this.baseUrl}/collaterals/deleted`).pipe(
      catchError(error => {
        console.error('Failed to fetch deleted collaterals:', error.statusText);
        return throwError(() => new Error(error.statusText));
      })
    );
  }

  getCurrentAccountsByCifSerialNumber(serialNumber: string): Observable<CurrentAccountDTO[]> {
    return this.http.get<CurrentAccountDTO[]>(`${this.baseUrl}/current-accounts/serial/${serialNumber}`).pipe(
      catchError(error => {
        console.error(`Failed to fetch current accounts for serial number ${serialNumber}:`, error);
        return throwError(() => new Error(error.statusText));
      })
    );
  }

  getCurrentAccountsByCifId(cifId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/current-accounts/by-cif/${cifId}`);
  }

  getCollateralsByCifId(cifId: number): Observable<Collateral[]> {
    return this.http.get<Collateral[]>(`${this.baseUrl}/collaterals/cif/${cifId}`).pipe(
      catchError(error => {
        console.error(`Failed to fetch collaterals for CIF ${cifId}:`, error);
        return throwError(() => new Error(error.statusText));
      })
    );
  }
}
