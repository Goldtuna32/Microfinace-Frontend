// src/app/models/role-permission.ts
export interface RolePermissionDTO {
  id?: number;
  role: RoleDTO;
  permission: PermissionDTO;
}

export interface RoleDTO {
  id?: number;
  name: string;
  description?: string; // Optional as per your DTO
  permissions: PermissionDTO[];
}

export interface PermissionDTO {
  id?: number;
  name: string;
  permissionFunction: string;
  description: string;
}