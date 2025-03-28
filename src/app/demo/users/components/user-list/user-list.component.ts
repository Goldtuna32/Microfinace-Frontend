import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { UserDTO, UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule,ReactiveFormsModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 }))
      ])
    ]),
    trigger('rotateIcon', [
      state('active', style({ transform: 'rotate(0deg)' })),
      state('inactive', style({ transform: 'rotate(180deg)' })),
      transition('active <=> inactive', animate('300ms ease-out'))
    ])
  ]
})
export class UserListComponent {
  users: UserDTO[] = [];
  inactiveUsers: UserDTO[] = [];
  showInactive: boolean = false;
  searchTerm = '';
  
  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        // Assuming we need to fetch all users - you might need a specific endpoint
        this.users = []; // Replace with actual all users endpoint when available
      },
      error: (err) => console.error('Error loading users:', err)
    });
  }

  loadInactiveUsers() {
    // You might need to add this method to UserService
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.inactiveUsers = users.filter(u => u.status === 0);
        this.users = users.filter(u => u.status === 1);
      },
      error: (err) => console.error('Error loading inactive users:', err)
    });
  }

  filterUsers() {
    // Implement your filtering logic here
    console.log('Filtering by:', this.searchTerm);
  }

  toggleUserStatus(id: number) {
    console.log('Toggle status for user:', id);
    // Implement status toggle logic
  }

  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      console.log('Delete user:', id);
      // Implement delete logic
    }
  }


  getRoleName(roleId: number): string {
    const roles: {[key: number]: string} = {
      1: 'Admin',
      2: 'Manager',
      3: 'Staff',
      4: 'Guest'
    };
    return roles[roleId] || 'Unknown';
  }

  getBranchName(branchId: number): string {
    const branches: {[key: number]: string} = {
      1: 'Main Branch',
      2: 'North Branch',
      3: 'South Branch'
    };
    return branches[branchId] || 'Unknown';
  }

  toggleInactive() {
    this.showInactive = !this.showInactive;
    if (this.showInactive && this.inactiveUsers.length === 0) {
      this.loadInactiveUsers();
    }
  }

  editUser(id?: number) {
    if (id) {
      this.router.navigate(['/users/edit', id]);
    }
  }
}
