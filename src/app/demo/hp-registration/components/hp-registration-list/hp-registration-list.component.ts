import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HpRegistrationService } from '../../services/hp-registration.service';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { HpRegistration } from '../../models/hp-registration';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/demo/users/services/user.service';

@Component({
  selector: 'app-hp-registration-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, FormsModule, ReactiveFormsModule],
  templateUrl:'./hp-registration-list.component.html',
  styleUrls: ['./hp-registration-list.component.scss']
})
export class HpRegistrationListComponent implements OnInit {
  hpRegistrations: HpRegistration[] = [];
  paginatedHpRegistrations: HpRegistration[] = [];
  loading: boolean = true;
  error: string | null = null;
  pendingHpRegistrations: HpRegistration[] = [];
approvedHpRegistrations: HpRegistration[] = [];
currentDataSource: HpRegistration[] = [];
  currentPage: number = 1;
  branchId: number | null = null;
  pageSize: number = 5;
  sortColumn: keyof HpRegistration | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  currentTab: string = 'all';
  pendingCount: number = 0;
  approvedCount: number = 0;
  showDeleted: boolean = false;

  Math = Math;
  

  constructor(
    private hpService: HpRegistrationService,private userService: UserService, private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAllHpRegistrations();
  }

  

  loadAllHpRegistrations(): void {
    this.loading = true;
    this.error = null;
    
    this.hpService.getAll().subscribe({
      next: (registrations) => {
        console.log('All HP Registrations Data:', registrations);
        
        // Process all registrations
        this.hpRegistrations = registrations.map(hp => ({
          ...hp,
          bankPortion: hp.loanAmount - hp.downPayment
        }));
        
        // Filter pending and approved
        this.pendingHpRegistrations = this.hpRegistrations.filter(hp => hp.status === 3);
        this.approvedHpRegistrations = this.hpRegistrations.filter(hp => hp.status === 4);
        
        // Set counts
        this.pendingCount = this.pendingHpRegistrations.length;
        this.approvedCount = this.approvedHpRegistrations.length;
        
        // Set initial data source
        this.currentDataSource = [...this.hpRegistrations];
        this.updatePagination();
        
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load HP registrations: ' + error.message;
        console.error('HP Registrations Error:', error);
        this.loading = false;
      }
    });
  }

  updateCounts(): void {
    // Get counts from the full dataset (may need separate API calls)
    this.pendingCount = this.hpRegistrations.filter(hp => hp.status === 3).length;
    this.approvedCount = this.hpRegistrations.filter(hp => hp.status === 4).length;
  }


  toggleDeletedList(): void {
    this.showDeleted = !this.showDeleted;
    this.currentPage = 1; // Reset pagination
    this.sortColumn = null; // Reset sorting
    this.loadAllHpRegistrations();

  }

  sort(column: keyof HpRegistration): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.hpRegistrations.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return this.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }
      const strA = valueA?.toString() || '';
      const strB = valueB?.toString() || '';
      return this.sortDirection === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });

    this.updatePagination();
  }

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedHpRegistrations = this.currentDataSource.slice(start, end);
}

  getTotalPages(): number {
    return Math.ceil(this.hpRegistrations.length / this.pageSize);
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  viewSchedule(hp: HpRegistration): void {
    if (hp.id && hp.status === 4) {
      this.router.navigate(['/hp-schedule', hp.id]);
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  softDelete(id: number): void {
    this.hpService.softDeleteHpRegistration(id).subscribe({
      next: () => {
        this.loadAllHpRegistrations(); // Reload all data
      },
      error: (error) => {
        console.error('Error deleting HP registration:', error);
      },
    });
  }

  getStatusText(status: number): string {
    switch (status) {
        case 1: return 'Active';
        case 2: return 'Deleted';
        case 3: return 'Pending';
        case 4: return 'Approved';
        default: return 'Unknown';
    }
}

  filterByTab(): void {
    if (this.currentTab === 'pending') {
      this.paginatedHpRegistrations = this.hpRegistrations.filter(hp => hp.status === 3);
    } else if (this.currentTab === 'approved') {
      this.paginatedHpRegistrations = this.hpRegistrations.filter(hp => hp.status === 4);
    } else {
      this.paginatedHpRegistrations = [...this.hpRegistrations];
    }
  }

  // In setTab() method
setTab(tab: 'pending' | 'approved'): void {
  this.currentTab = tab;
  this.currentPage = 1;

  if (tab === 'pending') {
      this.hpRegistrations = [...this.pendingHpRegistrations]; // Consolidate data
      this.currentDataSource = this.pendingHpRegistrations;
  } else {
      this.hpRegistrations = [...this.approvedHpRegistrations]; // Consolidate data
      this.currentDataSource = this.approvedHpRegistrations;
  }
  this.updatePagination();
}


  // Restore a soft-deleted registration (set status to 1)
  restoreHpRegistration(id?: number): void {
    console.log('restoreHpRegistration function called with ID:', id);
  
    if (id !== undefined) {
      this.hpService.restoreHpRegistration(id).subscribe({
        next: () => {
          console.log(`HP Registration ${id} restored successfully`);
          this.loadAllHpRegistrations(); // Refresh the list
        },
        error: (error) => {
          console.error('Error restoring HP registration:', error);
        }
      });
    } else {
      console.warn('HP ID is undefined');
    }

    
  }
  approveHpRegistration(hp: HpRegistration): void {
    if (!hp.id) {
      this.error = 'Invalid HP registration';
      return;
    }

    // Calculate bank portion if not set
    const bankPortion = hp.bankPortion || (hp.loanAmount - hp.downPayment);

    if (confirm(`Are you sure you want to approve HP registration ${hp.hpNumber}?`)) {
      this.loading = true;
      this.hpService.approveHpRegistration(hp.id, bankPortion).subscribe({
        next: () => {
          this.loadAllHpRegistrations();
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Error approving HP registration: ' + error.message;
          this.loading = false;
        }
      });
    }
  }
}
