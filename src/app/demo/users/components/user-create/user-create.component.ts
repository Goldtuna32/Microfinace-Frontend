import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Branch, PermissionDTO, UserDTO, UserService } from '../../services/user.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BranchService } from 'src/app/demo/branch/services/branch.service';
import { RoleDTO, RoleService } from 'src/app/demo/role/services/role.service';

@Component({
  selector: 'app-user-create',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.scss'
})
export class UserCreateComponent implements OnInit{
  newUser: UserDTO = {
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
    roleId: 0,
    branchId: 0
  };
  file: File | null = null;
  roles: RoleDTO[] = [];
  branches: Branch[] = [];

  constructor(private userService: UserService, private roleService: RoleService, private branchService: BranchService) {}

  ngOnInit(): void {
    this.loadRoles();
    this.loadBranches();
  }

  loadRoles(): void {
    this.roleService.getAllRoles().subscribe({
      next: (roles) => this.roles = roles,
      error: (err) => console.error('Error loading roles:', err)
    });
  }

  loadBranches(): void {
    this.branchService.getBranches().subscribe({
      next: (branches) => this.branches = branches,
      error: (err) => console.error('Error loading branches:', err)
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
    } else {
      this.file = null;
    }
  }

  createUser(): void {
    if (this.newUser.roleId === 0 || this.newUser.branchId === 0) {
      console.error('Please select a role and branch');
      return;
    }

    this.userService.createUser(this.newUser, this.file ?? undefined).subscribe({
      next: (user) => {
        console.log('User created:', user);
        this.resetForm();
      },
      error: (err) => console.error('Error creating user:', err)
    });
  }

  resetForm(): void {
    this.newUser = {
      username: '',
      email: '',
      password: '',
      phoneNumber: '',
      roleId: 0,
      branchId: 0
    };
    this.file = null;
  }
}
