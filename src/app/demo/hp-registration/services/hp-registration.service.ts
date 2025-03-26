import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HpRegistration } from '../models/hp-registration';

@Injectable({
  providedIn: 'root',
})
export class HpRegistrationService {
 
 
  private apiUrl = 'http://localhost:8080/api/hp-registrations'; // Adjust if needed
  private http = inject(HttpClient);

  getAll(): Observable<HpRegistration[]> {
    return this.http.get<HpRegistration[]>(this.apiUrl); 
  }

  getById(id: number): Observable<HpRegistration> {
    return this.http.get<HpRegistration>(`${this.apiUrl}/${id}`);
  }

  // hpService.ts
getDeletedHpRegistrations(): Observable<{ content: HpRegistration[]; totalPages: number; totalElements: number }> {
  return this.http.get<{ content: HpRegistration[]; totalPages: number; totalElements: number }>(
    `${this.apiUrl}/deleted`  // Replace with your actual API endpoint
  );
}


  create(data: HpRegistration): Observable<HpRegistration> {
    return this.http.post<HpRegistration>(this.apiUrl, data);
  }

  update(id: number, data: HpRegistration): Observable<HpRegistration> {
    return this.http.put<HpRegistration>(`${this.apiUrl}/${id}`, data);
  }

  softDeleteHpRegistration(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/delete`, {});
  }

  // Restore a soft-deleted HP registration (set status to 1)
  restoreHpRegistration(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/restore`, {});
  }

  getAllHpRegistrations(): Observable<HpRegistration[]> {
    return this.http.get<HpRegistration[]>(this.apiUrl); // Ensure this returns an Observable
  }
  updateHpRegistrationStatus(id: number, status: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/status`, { status });
  }

  

}
