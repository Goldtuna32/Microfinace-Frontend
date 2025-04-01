import { Component, OnInit } from '@angular/core';
import { Branch, UserDTO, UserService } from '../../services/user.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BranchService } from 'src/app/demo/branch/services/branch.service';
import { RoleService } from 'src/app/demo/role/services/role.service';
import { RoleDTO } from 'src/app/demo/role/models/role-permission';

@Component({
  selector: 'app-user-create',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class UserCreateComponent implements OnInit {
  userForm: FormGroup;
  profilePicturePreview: string | ArrayBuffer | null = null;
  roles: RoleDTO[] = [];
  branches: Branch[] = [];
  loading = false;
  successMessage = '';
  errorMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private roleService: RoleService,
    private branchService: BranchService
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
      ]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      dob: [''],
      roleId: [null, [Validators.required, Validators.min(1)]],
      branchId: [null, [Validators.required, Validators.min(1)]],
      profilePicture: [null]
    });
  }

  ngOnInit(): void {
    this.loadRoles();
    this.loadBranches();
  }

  get formControls() {
    return this.userForm.controls;
  }

  loadRoles(): void {
    this.loading = true;
    this.roleService.getAllRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading roles:', err);
        this.errorMessage = 'Failed to load roles. Please try again later.';
        this.loading = false;
      }
    });
  }

  loadBranches(): void {
    this.loading = true;
    this.branchService.getBranches().subscribe({
      next: (branches) => {
        this.branches = branches;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading branches:', err);
        this.errorMessage = 'Failed to load branches. Please try again later.';
        this.loading = false;
      }
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.userForm.patchValue({ profilePicture: file });
      
      const reader = new FileReader();
      reader.onload = () => {
        this.profilePicturePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  clearProfilePicture(): void {
    this.userForm.patchValue({ profilePicture: null });
    this.profilePicturePreview = null;
    const input = document.getElementById('profilePicture') as HTMLInputElement;
    if (input) input.value = '';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  createUser(): void {
    if (this.userForm.invalid) {
      this.markFormGroupTouched(this.userForm);
      this.errorMessage = 'Please fill all required fields correctly.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.userForm.value;
    const formData = new FormData();

    // Prepare user data
    const userData = {
      username: formValue.username,
      email: formValue.email,
      password: formValue.password,
      phoneNumber: formValue.phoneNumber,
      dob: formValue.dob ? new Date(formValue.dob).toISOString() : null,
      roleId: Number(formValue.roleId),
      branchId: Number(formValue.branchId)
    };

    // Append JSON data
    const userBlob = new Blob([JSON.stringify(userData)], { type: 'application/json' });
    formData.append('user', userBlob);

    // Append profile picture
    if (formValue.profilePicture) {
      formData.append('file', formValue.profilePicture);
    }

    this.userService.createUser(formData).subscribe({
      next: (user) => {
        this.loading = false;
        this.successMessage = 'User created successfully!';
        this.resetForm();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('Error creating user:', err);
        this.loading = false;
        
        if (err.status === 409) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Failed to create user. Please check your inputs and try again.';
        }
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  resetForm(): void {
    this.userForm.reset({
      username: '',
      email: '',
      password: '',
      phoneNumber: '',
      dob: '',
      roleId: null,
      branchId: null,
      profilePicture: null
    });
    this.profilePicturePreview = null;
  }
}