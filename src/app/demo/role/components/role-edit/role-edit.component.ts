// import { Component } from '@angular/core';
// import { RoleService } from '../../services/role.service';
// import { ActivatedRoute, Router } from '@angular/router';
// import { PermissionDTO, RoleDTO, RolePermissionDTO } from '../../models/role-permission';
// import { CommonModule } from '@angular/common';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-role-edit',
//   imports: [CommonModule, ReactiveFormsModule, FormsModule],
//   templateUrl: './role-edit.component.html',
//   styleUrl: './role-edit.component.scss'
// })
// export class RoleEditComponent {
//   // rolePermission: RolePermissionDTO = { 
//   //   role: { id: 0, name: '' }, 
//   //   permission: { id: 0, name: '', permissionFunction: '', description: '' } 
//   // };
//   roles: RoleDTO[] = [];
//   permissions: PermissionDTO[] = [];
//   rolePermissionId?: number;

//   constructor(
//     private rolePermissionService: RoleService,
//     private route: ActivatedRoute,
//     private router: Router
//   ) {
//     this.rolePermissionId = Number(this.route.snapshot.paramMap.get('id'));
//   }

//   ngOnInit() {
//     this.loadRoles();
//     this.loadPermissions();
//     if (this.rolePermissionId) {
//       this.loadRolePermission();
//     }
//   }

//   loadRolePermission() {
//     this.rolePermissionService.getAllRolePermissions().subscribe({
//       next: (rolePermissions) => {
//         const rp = rolePermissions.find(r => r.id === this.rolePermissionId);
//         if (rp) this.rolePermission = { ...rp };
//       },
//       error: (err) => console.error('Error loading role permission:', err)
//     });
//   }

//   loadRoles() {
//     this.rolePermissionService.getAllRoles().subscribe({
//       next: (roles) => this.roles = roles,
//       error: (err) => console.error('Error loading roles:', err)
//     });
//   }

//   loadPermissions() {
//     this.rolePermissionService.getAllPermissions().subscribe({
//       next: (permissions) => {
//         // Filter out any permissions with undefined id
//         this.permissions = permissions.filter(p => p.id !== undefined).map(p => ({
//           ...p,
//           id: p.id || 0 // Convert any possible undefined to 0
//         }));
//       },
//       error: (err) => console.error('Error loading permissions:', err)
//     });
//   }

//   saveRolePermission() {
//     if (this.rolePermissionId && this.rolePermission.permission.id) {
//       this.rolePermissionService.updateRolePermission(
//         this.rolePermissionId,
//         this.rolePermission.permission.id
//       ).subscribe({
//         next: () => this.router.navigate(['/role-permissions']),
//         error: (err) => console.error('Error updating role permission:', err)
//       });
//     }
//   }

//   cancel() {
//     this.router.navigate(['/role-permissions']);
//   }
// }
