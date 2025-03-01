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
 
@Component({
  selector: 'app-branch-list',
  imports: [ CommonModule, MatPaginator, MatSort, MatTableModule ],
  templateUrl: './branch-list.component.html',
  styleUrl: './branch-list.component.scss'
})
export class BranchListComponent {
  displayedColumns: string[] = ['branchCode', 'branchName', 'phoneNumber', 'email', 'address', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  loading = true;
  errorMessage = '';
  showModal: boolean = false;

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
