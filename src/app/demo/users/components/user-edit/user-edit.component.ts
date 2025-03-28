import { Component } from '@angular/core';
import { Branch, UserDTO, UserService } from '../../services/user.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchService } from 'src/app/demo/branch/services/branch.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoleDTO } from 'src/app/demo/role/models/role-permission';

@Component({
  selector: 'app-user-edit',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss'
})
export class UserEditComponent {
  user: UserDTO = {
    username: '',
    password: '',
    email: '',
    phoneNumber: '',
    roleId: 0,
    branchId: 0
  };
  selectedFile: File | null = null;
  userId?: number;
  roles: RoleDTO[] = [];
  branches: Branch[] = [];

  constructor(
    private userService: UserService,
    private branchService: BranchService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit() {
    this.loadRoles();
    this.loadBranches();
    if (this.userId) {
      this.loadUser();
    }
  }

  loadUser() {
    // You might need to add getUserById to UserService
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        // Convert string date to Date object if dob exists
        const userWithDateDob = {
          ...user,
          password: '', // Don't show password
          dob: user.dob ? new Date(user.dob) : undefined
        };
        this.user = userWithDateDob;
      },
      error: (err) => console.error('Error loading user:', err)
    });
  }

  loadRoles() {
    this.userService.getAllRoles().subscribe({
      next: (roles) => this.roles = roles,
      error: (err) => console.error('Error loading roles:', err)
    });
  }

  loadBranches() {
    // You might need to add this endpoint to UserService
    this.branchService.getBranches().subscribe({
      next: (branches) => this.branches = branches,
      error: (err) => console.error('Error loading branches:', err)
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  saveUser() {
    const formData = new FormData();
    const userData = {
      username: this.user.username,
      password: this.user.password,
      email: this.user.email,
      phoneNumber: this.user.phoneNumber,
      dob: this.user.dob,
      profilePicture: this.user.profilePicture,
      status: this.user.status,
      roleId: this.user.roleId,
      branchId: this.user.branchId
    };
    
    formData.append('user', JSON.stringify(userData));
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.userService.createUser(formData).subscribe({
      next: () => this.router.navigate(['/users']),
      error: (err) => console.error('Error updating user:', err)
    });
  }

  cancel() {
    this.router.navigate(['/users']);
  }
}
