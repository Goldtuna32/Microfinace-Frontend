import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PermissionDTO, RoleDTO, RolePermissionDTO } from '../models/role-permission';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private rolesApiUrl = 'http://localhost:8080/api/roles';
  private rolePermissionsApiUrl = 'http://localhost:8080/api/role-permissions';

  constructor(private http: HttpClient) {}

  // Role operations
  createRole(role: RoleDTO): Observable<RoleDTO> {
    return this.http.post<RoleDTO>(this.rolesApiUrl, role);
  }

  getAllRoles(): Observable<RoleDTO[]> {
    return this.http.get<RoleDTO[]>(this.rolesApiUrl);
  }

  // RolePermission operations
  getAllRolePermissions(): Observable<RolePermissionDTO[]> {
    return this.http.get<RolePermissionDTO[]>(this.rolePermissionsApiUrl);
  }

  getRolePermissionsByRoleId(roleId: number): Observable<RolePermissionDTO[]> {
    return this.http.get<RolePermissionDTO[]>(`${this.rolePermissionsApiUrl}/role/${roleId}`);
  }

  updateRolePermission(id: number, permissionId: number): Observable<RolePermissionDTO> {
    const params = { permissionId: permissionId.toString() };
    return this.http.put<RolePermissionDTO>(`${this.rolePermissionsApiUrl}/${id}`, null, { params });
  }

  deleteRolePermission(id: number): Observable<void> {
    return this.http.delete<void>(`${this.rolePermissionsApiUrl}/${id}`);
  }

  // Permission operations
  getAllPermissions(): Observable<PermissionDTO[]> {
    return this.http.get<PermissionDTO[]>('http://localhost:8080/api/permissions');
  }
}