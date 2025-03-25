import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HpRegistrationService } from '../../services/hp-registration.service';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { HpRegistration } from '../../models/hp-registration';

@Component({
  selector: 'app-hp-registration-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule],
  templateUrl:'./hp-registration-list.component.html',
  styleUrls: ['./hp-registration-list.component.scss']
})
export class HpRegistrationListComponent implements OnInit {
  hpRegistrations: HpRegistration[] = [];
  paginatedHpRegistrations: HpRegistration[] = [];
  loading: boolean = true;
  error: string | null = null;
  currentPage: number = 1;
  pageSize: number = 5; // Default page size
  sortColumn: keyof HpRegistration | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  showDeleted = true;
console: any;

  constructor(
    private hpService: HpRegistrationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadHpRegistrations();
  }

  loadHpRegistrations(): void {
    this.loading = true;
    
    const serviceCall = this.hpService.getAllHpRegistrations();
    
    serviceCall.subscribe({
      next: (response: HpRegistration[]) => {  // Adjust to handle an array response
        this.hpRegistrations = response;
        this.updatePagination();
        this.loading = false;
        this.error = null;
      },
      error: (error) => {
        this.error = 'Error loading HP registrations. Please try again later.';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }
  
  

  toggleDeletedList(): void {
    this.showDeleted = !this.showDeleted;
    this.currentPage = 1; // Reset pagination
    this.sortColumn = null; // Reset sorting
    this.loadHpRegistrations();
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
    this.paginatedHpRegistrations = this.hpRegistrations.slice(start, end);
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
        this.loadHpRegistrations(); // Reload the list after the soft delete
      },
      error: (error) => {
        console.error('Error deleting HP registration:', error);
      },
    });
  }

  // Restore a soft-deleted registration (set status to 1)
  restoreHpRegistration(id?: number): void {
    console.log('restoreHpRegistration function called with ID:', id);
  
    if (id !== undefined) {
      this.hpService.restoreHpRegistration(id).subscribe({
        next: () => {
          console.log(`HP Registration ${id} restored successfully`);
          this.loadHpRegistrations(); // Refresh the list
        },
        error: (error) => {
          console.error('Error restoring HP registration:', error);
        }
      });
    } else {
      console.warn('HP ID is undefined');
    }
  }
  



  
}
