import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductType } from '../models/product-type';

@Injectable({
  providedIn: 'root'
})
export class ProductTypeService {
  private apiUrl = 'http://localhost:8080/api/product-types';

  constructor(private http: HttpClient) {}

  getAllProductTypes(): Observable<ProductType[]> {
    return this.http.get<ProductType[]>(this.apiUrl);
  }

  getProductTypeById(id: number): Observable<ProductType> {
    return this.http.get<ProductType>(`${this.apiUrl}/${id}`);
  }

  createProductType(productType: Omit<ProductType, 'id'>): Observable<ProductType> {
    return this.http.post<ProductType>(this.apiUrl, productType);
  }

  updateProductType(productType: ProductType): Observable<ProductType> {
    return this.http.put<ProductType>(
      `${this.apiUrl}/${productType.id}`,
      productType
    );
  }

  deleteProductType(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  restoreProductType(id: number): Observable<ProductType> {
    return this.http.put<ProductType>(`${this.apiUrl}/${id}/restore`, {});
  }
}
