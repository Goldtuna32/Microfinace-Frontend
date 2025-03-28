import { Component } from '@angular/core';
import { RoleService } from '../../services/role.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RolePermission } from '../../models/role-permission';

@Component({
  selector: 'app-role-detail',
  imports: [],
  templateUrl: './role-detail.component.html',
  styleUrl: './role-detail.component.scss'
})
export class RoleDetailComponent {
  rolePermission?: RolePermission;
  rolePermissionId?: number;

  constructor(
    private rolePermissionService: RoleService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.rolePermissionId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit() {
    if (this.rolePermissionId) {
      this.loadRolePermission();
    }
  }

  loadRolePermission() {
    this.rolePermissionService.getAllRolePermissions().subscribe({
      next: (rolePermissions) => {
        this.rolePermission = rolePermissions.find(r => r.id === this.rolePermissionId);
      },
      error: (err) => console.error('Error loading role permission:', err)
    });
  }

  backToList() {
    this.router.navigate(['/role-permissions']);
  }
}
