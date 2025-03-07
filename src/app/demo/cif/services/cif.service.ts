import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CIF } from '../models/cif.model';



@Injectable({
  providedIn: 'root'
})
export class CifService {
  private baseUrl = 'http://localhost:8080/api/cifs'; 

  constructor(private http: HttpClient) {}

  getAllCIFs(
    page: number = 0,
    size: number = 10,
    sortBy: string = 'id',
    direction: string = 'asc'
  ): Observable<{ content: CIF[]; totalPages: number; totalElements: number }> {
    return this.http.get<{ content: CIF[], totalPages: number, totalElements: number }>(
      `${this.baseUrl}/active?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`
    );
  }

  getDeletedCIFs(
    page: number = 0,
    size: number = 10,
    sortBy: string = 'id',
    direction: string = 'asc'
  ): Observable<{ content: CIF[]; totalPages: number; totalElements: number }> {
    return this.http.get<{ content: CIF[], totalPages: number, totalElements: number }>(
      `${this.baseUrl}/deleted?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`
    );
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
