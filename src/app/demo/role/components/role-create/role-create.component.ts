import { Component } from '@angular/core';
import { RoleDTO, RoleService } from '../../services/role.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-role-create',
  imports: [CommonModule,ReactiveFormsModule, FormsModule],
  templateUrl: './role-create.component.html',
  styleUrl: './role-create.component.scss'
})
export class RoleCreateComponent {
  newRole: RoleDTO = {
    name: '',
    description: '',
    permissions: []
  };
  selectedPermissions: string[] = [];
  permissionGroups: { [key: string]: string[] } = {
    'BRANCH': ['BRANCH_CREATE', 'BRANCH_READ', 'BRANCH_UPDATE', 'BRANCH_DELETE'],
    'CIF': ['CIF_CREATE', 'CIF_READ', 'CIF_UPDATE', 'CIF_DELETE'],
    'CURRENT_ACCOUNT': ['CURRENT_ACCOUNT_CREATE', 'CURRENT_ACCOUNT_READ', 'CURRENT_ACCOUNT_UPDATE', 'CURRENT_ACCOUNT_DELETE'],
    'TRANSACTION': ['TRANSACTION_CREATE', 'TRANSACTION_READ', 'TRANSACTION_UPDATE', 'TRANSACTION_DELETE'],
    'COLLATERAL_TYPE': ['COLLATERAL_TYPE_CREATE', 'COLLATERAL_TYPE_READ', 'COLLATERAL_TYPE_UPDATE', 'COLLATERAL_TYPE_DELETE'],
    'COLLATERAL': ['COLLATERAL_CREATE', 'COLLATERAL_READ', 'COLLATERAL_UPDATE', 'COLLATERAL_DELETE'],
    'LOAN': ['LOAN_CREATE', 'LOAN_READ', 'LOAN_UPDATE', 'LOAN_DELETE'],
    'DEALER': ['DEALER_CREATE', 'DEALER_READ', 'DEALER_UPDATE', 'DEALER_DELETE'],
    'PRODUCT_TYPE': ['PRODUCT_TYPE_CREATE', 'PRODUCT_TYPE_READ', 'PRODUCT_TYPE_UPDATE', 'PRODUCT_TYPE_DELETE'],
    'HP_PRODUCT': ['HP_PRODUCT_CREATE', 'HP_PRODUCT_READ', 'HP_PRODUCT_UPDATE', 'HP_PRODUCT_DELETE']
  };
  expandedGroups: { [key: string]: boolean } = {};

  constructor(private roleService: RoleService) {}

  ngOnInit(): void {
    Object.keys(this.permissionGroups).forEach(group => this.expandedGroups[group] = true);
  }

  onPermissionToggle(permission: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const checked = input.checked;
    if (checked) {
      if (!this.selectedPermissions.includes(permission)) {
        this.selectedPermissions.push(permission);
      }
    } else {
      this.selectedPermissions = this.selectedPermissions.filter(p => p !== permission);
    }
  }

  onSelectAllToggle(group: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const checked = input.checked;
    const groupPermissions = this.permissionGroups[group];
    if (checked) {
      groupPermissions.forEach(perm => {
        if (!this.selectedPermissions.includes(perm)) {
          this.selectedPermissions.push(perm);
        }
      });
    } else {
      this.selectedPermissions = this.selectedPermissions.filter(perm => !groupPermissions.includes(perm));
    }
  }

  isAllSelected(group: string): boolean {
    const groupPermissions = this.permissionGroups[group];
    return groupPermissions.every(perm => this.selectedPermissions.includes(perm));
  }

  toggleGroup(group: string): void {
    this.expandedGroups[group] = !this.expandedGroups[group];
  }

  createRole(): void {
    if (!this.newRole.name || !this.newRole.description) {
      console.error('Role name and description are required');
      return;
    }

    // Map selected permissions to PermissionDTO objects
    this.newRole.permissions = this.selectedPermissions.map(perm => {
      const [permissionFunction, name] = perm.split('_');
      return {
        permissionFunction,
        name,
        description: `${name} permission for ${permissionFunction}`
      };
    });

    this.roleService.createRole(this.newRole).subscribe({
      next: (role) => {
        console.log('Role created:', role);
        this.resetForm();
      },
      error: (err) => console.error('Error creating role:', err)
    });
  }

  resetForm(): void {
    this.newRole = {
      name: '',
      description: '',
      permissions: []
    };
    this.selectedPermissions = [];
    Object.keys(this.expandedGroups).forEach(group => this.expandedGroups[group] = true);
  }
}
