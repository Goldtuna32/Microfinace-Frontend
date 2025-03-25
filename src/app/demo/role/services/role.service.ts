import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RoleDTO {
  id?: number;
  name: string;
  description: string;
  permissions?: PermissionDTO[];
}

export interface PermissionDTO {
  id?: number;
  permissionFunction: string;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = 'http://localhost:8080/api/roles';

  constructor(private http: HttpClient) {}

  createRole(role: RoleDTO): Observable<RoleDTO> {
    return this.http.post<RoleDTO>(this.apiUrl, role);
  }

  getAllRoles(): Observable<RoleDTO[]> {
    return this.http.get<RoleDTO[]>(this.apiUrl);
  }
}