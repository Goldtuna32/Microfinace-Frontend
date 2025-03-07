import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BranchService } from '../../services/branch.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { Branch } from '../../models/branch.model';
import { BranchDetailComponent } from '../branch-detail/branch-detail.component';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
 
@Component({
  selector: 'app-branch-list',
  imports: [ CommonModule, MatPaginator, MatSort, MatTableModule, MatMenuModule, MatButtonModule, FormsModule ],
  templateUrl: './branch-list.component.html',
  styleUrl: './branch-list.component.scss'
})
export class BranchListComponent {
  displayedColumns: string[] = ['branchCode', 'branchName', 'phoneNumber', 'email', 'address', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  loading = true;
  errorMessage = '';
  showModal: boolean = false;
  showEditModal: boolean = false;
  originalBranch: Branch | null = null; // Store original for rollback

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selectedBranch: any | null = null; // ✅ Store selected branch

  constructor(private branchService: BranchService, private snackBar: MatSnackBar, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadBranches();
  }

  loadBranches() {
    this.branchService.getBranchesWith().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load branches. Please try again.';
        console.error('Error fetching branches:', error);
        this.loading = false;
      }
    });
  }

  editBranch(branch: Branch) {
    this.originalBranch = { ...branch }; // Store original for cancellation
    this.selectedBranch = { ...branch }; // Work on a copy
    this.showEditModal = true;
  }

  // Save changes
  saveBranch() {
    if (!this.selectedBranch || !this.selectedBranch.id) return;

    // Basic validation
    if (!this.selectedBranch.branchCode || !this.selectedBranch.branchName || !this.selectedBranch.phoneNumber || !this.selectedBranch.email) {
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

  // Delete branch
  deleteBranch(id: number) {
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

  closeModal() {
    this.showEditModal = false;
    this.selectedBranch = null;
  }

  openBranchDetailDialog(branch: Branch) {
    this.dialog.open(BranchDetailComponent, {
      width: '90%',
      maxWidth: '900px',
      height: 'auto',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
      data: branch
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
