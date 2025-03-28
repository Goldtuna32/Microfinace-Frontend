import { Component } from '@angular/core';
import { RoleService } from '../../services/role.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoleDTO, RolePermissionDTO } from '../../models/role-permission';

@Component({
  selector: 'app-role-list',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.scss'
})
export class RoleListComponent {
  rolePermissions: RolePermissionDTO[] = [];
  roles: RoleDTO[] = [];
  selectedRoleId?: number;

  constructor(
    private roleService: RoleService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadRoles();
    this.loadAllRolePermissions();
  }

  loadRoles() {
    this.roleService.getAllRoles().subscribe({
      next: (roles) => this.roles = roles,
      error: (err) => console.error('Error loading roles:', err)
    });
  }

  loadAllRolePermissions() {
    this.roleService.getAllRolePermissions().subscribe({
      next: (rolePermissions) => this.rolePermissions = rolePermissions,
      error: (err) => console.error('Error loading role permissions:', err)
    });
  }

  filterByRole() {
    if (this.selectedRoleId) {
      this.roleService.getRolePermissionsByRoleId(this.selectedRoleId).subscribe({
        next: (rolePermissions) => this.rolePermissions = rolePermissions,
        error: (err) => console.error('Error loading filtered role permissions:', err)
      });
    } else {
      this.loadAllRolePermissions();
    }
  }

  editRolePermission(id?: number) {
    if (id) {
      this.router.navigate(['/role-permissions/edit', id]);
    }
  }

  viewDetails(id?: number) {
    if (id) {
      this.router.navigate(['/role-permissions/details', id]);
    }
  }

  deleteRolePermission(id?: number) {
    if (id && confirm('Are you sure you want to delete this role permission?')) {
      this.roleService.deleteRolePermission(id).subscribe({
        next: () => this.loadAllRolePermissions(),
        error: (err) => console.error('Error deleting role permission:', err)
      });
    }
  }
}
