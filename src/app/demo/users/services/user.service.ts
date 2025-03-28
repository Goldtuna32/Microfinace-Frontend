import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/User.model';
import { RoleDTO } from '../../role/models/role-permission';

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
  code: string;
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

  createUser(userData: FormData): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${this.apiUrl}/register`, userData);
  }

  getAllRoles(): Observable<RoleDTO[]> {
    return this.http.get<RoleDTO[]>(this.rolesUrl);
  }

  getAllPermissions(): Observable<PermissionDTO[]> {
    return this.http.get<PermissionDTO[]>(`${this.apiUrl}/permissions`);
  }

  getAllUsers(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/${id}`);
  }

  updateUser(id: number, userData: FormData): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.apiUrl}/${id}`, userData);
  }
}
