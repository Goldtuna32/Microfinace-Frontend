import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, switchMap } from 'rxjs';
import { CIF } from '../models/cif.model';

export interface PageInfo {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface PageResponse<T> {
  content: T[];
  page: PageInfo;
}


@Injectable({
  providedIn: 'root'
})
export class CifService {
  private baseUrl = 'http://localhost:8080/api/cifs'; 

  constructor(private http: HttpClient) {}

  checkDuplicate(cifData: Partial<CIF>): Observable<boolean> {
    let params = new HttpParams();
    if (cifData.name) params = params.set('name', cifData.name);
    if (cifData.nrcNumber) params = params.set('nrcNumber', cifData.nrcNumber);
    if (cifData.phoneNumber) params = params.set('phoneNumber', cifData.phoneNumber);
    if (cifData.email) params = params.set('email', cifData.email);

    return this.http.get<{ isDuplicate: boolean }>(`${this.baseUrl}/check-duplicate`, { params }).pipe(
      map(response => response.isDuplicate)
    );
  }

  getAllCIFs(page: number, size: number, nrcPrefix?: string): Observable<PageResponse<CIF>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    if (nrcPrefix) params = params.set('nrcPrefix', nrcPrefix);

    return this.http.get<PageResponse<CIF>>(`${this.baseUrl}/active`, { params });
  }

  getDeletedCIFs(page: number, size: number, nrcPrefix?: string): Observable<PageResponse<CIF>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    if (nrcPrefix) params = params.set('nrcPrefix', nrcPrefix);

    return this.http.get<PageResponse<CIF>>(`${this.baseUrl}/deleted`, { params });
  }
  
  updateCIF(id: number, cifData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, cifData);
  }  

  deleteCIF(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  restoreCIF(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/restore`, null);
  }

  getCIFById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }


  createCIF(cifData: FormData): Observable<any> {
    return this.http.post<any>(this.baseUrl, cifData);
  }

  
}
