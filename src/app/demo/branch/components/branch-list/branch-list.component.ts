// branch-list.component.ts
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BranchService, PageResponse } from '../../services/branch.service';
import { Branch } from '../../models/branch.model';
import { BranchDetailComponent } from '../branch-detail/branch-detail.component';

// Standalone imports
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-branch-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    FormsModule,
    SharedModule
  ],
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss']
})
export class BranchListComponent implements AfterViewInit {
  displayedColumns: string[] = ['branchCode', 'branchName', 'phoneNumber', 'email', 'address', 'status', 'actions'];
  dataSource = new MatTableDataSource<Branch>([]);
  loading = true;
  errorMessage = '';
  showEditModal = false;
  originalBranch: Branch | null = null;
  selectedBranch: Branch | null = null;

  // Pagination variables
  pageSize = 10;
  currentPage = 0;
  totalElements = 0;
  totalPages = 0;

  // Filter variables
  filterRegion: string = '';
  filterBranchName: string = '';
  filterBranchCode: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private branchService: BranchService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) 
    {
      this.loadBranches(); // Load initial data
    }

  ngAfterViewInit(): void {
    // Sync paginator with backend
    this.paginator.page.subscribe(() => {
      this.currentPage = this.paginator.pageIndex; // 0-based index
      this.pageSize = this.paginator.pageSize;
      this.loadBranches();
    });

    // Initial data load
    this.loadBranches();
  }

  loadBranches(): void {
    this.loading = true;
    const filters = {
      region: this.filterRegion.trim() || undefined,
      branchName: this.filterBranchName.trim() || undefined,
      branchCode: this.filterBranchCode.trim() || undefined
    };
    this.branchService.getBranchesWith(this.currentPage, this.pageSize, filters).subscribe({
      next: (response: PageResponse<Branch>) => {
        this.dataSource.data = response.content;
        this.totalElements = response.page.totalElements;
        this.totalPages = response.page.totalPages;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load branches. Please try again.';
        console.error('Error fetching branches:', error);
        this.loading = false;
      }
    });
  }

  editBranch(branch: Branch): void {
    this.originalBranch = { ...branch };
    this.selectedBranch = {
      ...branch,
      address: branch.address || { region: '', district: '', township: '' } // Default empty object if null
    };
    this.showEditModal = true;
  }

  saveBranch(): void {
    if (!this.selectedBranch || !this.selectedBranch.id) return;

    if (!this.selectedBranch.branchCode || !this.selectedBranch.branchName || 
        !this.selectedBranch.phoneNumber || !this.selectedBranch.email) {
      this.snackBar.open('Please fill in all required fields', 'Close', { duration: 3000 });
      return;
    }

    this.branchService.updateBranch(this.selectedBranch.id, this.selectedBranch).subscribe({
      next: () => {
        this.snackBar.open('Branch updated successfully', 'Close', { duration: 3000 });
        this.showEditModal = false;
        this.loadBranches();
        this.selectedBranch = null;
        this.originalBranch = null;
      },
      error: (error) => {
        this.snackBar.open('Failed to update branch', 'Close', { duration: 3000 });
        console.error('Error updating branch:', error);
      }
    });
  }

  deleteBranch(id: number): void {
    if (confirm('Are you sure you want to delete this branch?')) {
      this.branchService.deleteBranch(id).subscribe({
        next: () => {
          this.snackBar.open('Branch deleted successfully', 'Close', { duration: 3000 });
          this.loadBranches();
        },
        error: (error) => {
          this.snackBar.open('Failed to delete branch', 'Close', { duration: 3000 });
          console.error('Error deleting branch:', error);
        }
      });
    }
  }

  closeModal(): void {
    this.showEditModal = false;
    this.selectedBranch = null;
  }

  openBranchDetailDialog(branch: Branch): void {
    this.dialog.open(BranchDetailComponent, {
      width: '90%',
      maxWidth: '900px',
      height: 'auto',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
      data: branch
    });
  }

 applyFilter(): void {
    this.currentPage = 0; // Reset to first page when filtering
    this.loadBranches();
  }

  clearFilter(): void {
    this.filterRegion = '';
    this.filterBranchName = '';
    this.filterBranchCode = '';
    this.currentPage = 0;
    this.loadBranches();
  }

  // Pagination methods
  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadBranches();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadBranches();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadBranches();
  }

  getPageNumbers(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i);
  }
}