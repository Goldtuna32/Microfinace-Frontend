import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/User.model';
import { RoleDTO } from '../../role/services/role.service';

export interface UserDTO {
  id?: number;
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
  dob?: Date;
  profilePicture?: string;
  status?: number;
  roleId: number;
  branchId: number;
  lastLogin?: string; // LocalDateTime maps to string in JSON
  permissions?: PermissionDTO[];
}

export interface PermissionDTO {
  id: number;
  permissionFunction: string;
  name: string;
  description: string;
}
export interface Branch {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';
  private rolesUrl = 'http://localhost:8080/api/roles'; // Assuming this endpoint exists
  public currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<User> {
      return this.http.get<User>(`${this.apiUrl}/current`);
  }

  setCurrentUser(user: User) {
      this.currentUserSubject.next(user);
  }

  createUser(user: UserDTO, file?: File): Observable<UserDTO> {
    const formData = new FormData();
    formData.append('user', JSON.stringify(user));
    if (file) {
      formData.append('file', file);
    }
    console.log('Sending FormData:', user.permissions);
    return this.http.post<UserDTO>(`${this.apiUrl}/register`, formData);
  }

  getAllRoles(): Observable<RoleDTO[]> {
    return this.http.get<RoleDTO[]>(this.rolesUrl);
  }

  getAllPermissions(): Observable<PermissionDTO[]> {
    return this.http.get<PermissionDTO[]>(`${this.apiUrl}/permissions`);
  }
}
