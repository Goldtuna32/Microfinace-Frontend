import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// FormData is already available globally in modern browsers
// No need to import it from a polyfill

export interface Collateral {
  id?: number;
  price: number;
  description: string;
  F_collateralPhoto?: File;
  B_collateralPhoto?: File;
  status: number;
  cifId: number;
  collateralTypeId: number;
  collateralCode?: string;
  date?: Date;
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
    return this.http.get<Collateral[]>(`${this.baseUrl}/collaterals`);
  }

  getAllCifs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/cifs`);
  }
}
