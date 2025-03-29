import { Component } from '@angular/core';
import { RoleService } from '../../services/role.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PermissionDTO, RoleDTO, RolePermissionDTO } from '../../models/role-permission';

declare var bootstrap: any; // This declares the bootstrap variable from Bootstrap JS

@Component({
  selector: 'app-role-list',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.scss'
})
export class RoleListComponent {
  roles: RoleDTO[] = [];
  selectedRole: RoleDTO | null = null;
  selectedRolePermissions: RolePermissionDTO[] = [];
  availablePermissions: PermissionDTO[] = [];
  selectedPermissionId?: number;
  
  // Modal references
  private rolePermissionsModal: any;
  private addPermissionModal: any;

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  totalItems: number = 0;

  constructor(
    private roleService: RoleService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadRoles();
  }

  ngAfterViewInit() {
    // Initialize modals after view is initialized
    this.rolePermissionsModal = new bootstrap.Modal(document.getElementById('rolePermissionsModal'));
    this.addPermissionModal = new bootstrap.Modal(document.getElementById('addPermissionModal'));
  }

  loadRoles() {
    this.roleService.getAllRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        this.totalItems = roles.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      },
      error: (err) => console.error('Error loading roles:', err)
    });
  }

  viewRolePermissions(roleId: number) {
    const role = this.roles.find(r => r.id === roleId);
    if (role) {
      this.selectedRole = role;
      this.roleService.getRolePermissionsByRoleId(roleId).subscribe({
        next: (permissions) => {
          this.selectedRolePermissions = permissions;
          this.loadAvailablePermissions();
          this.rolePermissionsModal.show();
        },
        error: (err) => console.error('Error loading role permissions:', err)
      });
    }
  }

  loadAvailablePermissions() {
    this.roleService.getAllPermissions().subscribe({
      next: (permissions) => {
        const assignedPermissionIds = this.selectedRolePermissions.map(rp => rp.permission.id);
        this.availablePermissions = permissions.filter(
          p => !assignedPermissionIds.includes(p.id)
        );
      },
      error: (err) => console.error('Error loading permissions:', err)
    });
  }

  openAddPermissionModal() {
    this.rolePermissionsModal.hide();
    this.addPermissionModal.show();
  }

  addPermissionToRole() {
    if (this.selectedRole?.id && this.selectedPermissionId !== undefined) {
      const roleId = this.selectedRole.id;
      const permissionId = this.selectedPermissionId;
      
      this.roleService.addPermissionToRole(roleId, permissionId).subscribe({
        next: () => {
          this.viewRolePermissions(roleId);
          this.addPermissionModal.hide();
        },
        error: (err) => console.error('Error adding permission:', err)
      });
    }
  }

  removePermissionFromRole(rolePermissionId: number) {
    if (confirm('Are you sure you want to remove this permission from the role?')) {
      this.roleService.deleteRolePermission(rolePermissionId).subscribe({
        next: () => {
          if (this.selectedRole?.id) {
            this.viewRolePermissions(this.selectedRole.id);
          }
        },
        error: (err) => console.error('Error removing permission:', err)
      });
    }
  }

  editRole(roleId: number) {
    this.router.navigate(['/roles/edit', roleId]);
  }

  deleteRole(roleId: number) {
    if (confirm('Are you sure you want to delete this role?')) {
      this.roleService.deleteRole(roleId).subscribe({
        next: () => this.loadRoles(),
        error: (err) => console.error('Error deleting role:', err)
      });
    }
  }

  // Pagination methods
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPages(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage: number;
      let endPage: number;
      
      if (this.currentPage <= Math.ceil(maxVisiblePages / 2)) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (this.currentPage + Math.floor(maxVisiblePages / 2) >= this.totalPages) {
        startPage = this.totalPages - maxVisiblePages + 1;
        endPage = this.totalPages;
      } else {
        startPage = this.currentPage - Math.floor(maxVisiblePages / 2);
        endPage = this.currentPage + Math.floor(maxVisiblePages / 2);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }
}
