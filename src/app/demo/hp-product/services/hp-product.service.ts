import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HpProduct, HpProductCreate } from '../models/hp-product';

export interface ProductType {
  id: number;
  name: string;
}

export interface DealerRegistration {
  id: number;
  companyName: string; 
}

@Injectable({
  providedIn: 'root'
})
export class HpProductService {
  private apiUrl = 'http://localhost:8080/api/hp-products'; 
  private productTypeUrl = 'http://localhost:8080/api/product-types';
  private dealerRegistrationUrl = 'http://localhost:8080/api/dealer-registration';

  constructor(private http: HttpClient) {}

  getAllHpProducts(): Observable<HpProduct[]> {
    return this.http.get<HpProduct[]>(this.apiUrl);
  }

  getHpProductById(id: number): Observable<HpProduct> {
    return this.http.get<HpProduct>(`${this.apiUrl}/${id}`);
  }

  createHpProduct(hpProduct: HpProductCreate, photo: File): Observable<HpProduct> {
    const formData = new FormData();
    formData.append('hpProduct', new Blob([JSON.stringify(hpProduct)], { type: 'application/json' }));
    formData.append('photo', photo);

    return this.http.post<HpProduct>(this.apiUrl, formData);
  }

  updateHpProduct(id: number, hpProduct: HpProductCreate, photo: File | null): Observable<HpProduct> {
    const formData = new FormData();
    console.log('Sending hpProduct:', hpProduct); // Log what’s being sent
    formData.append('hpProduct', new Blob([JSON.stringify(hpProduct)], { type: 'application/json' }));
    if (photo) {
      formData.append('photo', photo);
    }
    return this.http.put<HpProduct>(`${this.apiUrl}/${id}`, formData);
  }

  deleteHpProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  restoreHpProduct(id: number): Observable<HpProduct> {
    return this.http.put<HpProduct>(`${this.apiUrl}/${id}/restore`, {});
  }

  getProductTypes(): Observable<ProductType[]> {
    return this.http.get<ProductType[]>(this.productTypeUrl);
  }

  getDealerRegistrations(): Observable<DealerRegistration[]> {
    return this.http.get<DealerRegistration[]>(`${this.dealerRegistrationUrl}/all`);
  }
}

