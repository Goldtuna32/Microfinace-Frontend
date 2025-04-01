import { Component, OnInit, ViewChild } from '@angular/core';
import { CollateralType } from '../../models/collateralType.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { CollateralTypeService } from '../../services/collateral-type.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSpinner } from '@angular/material/progress-spinner';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { CollateralTypeEditComponent } from '../collateral-type-edit/collateral-type-edit.component';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/demo/users/services/user.service';

@Component({
  selector: 'app-collateral-type-list',
  imports: [ MatPaginator, MatTableModule, CommonModule],
  templateUrl: './collateral-type-list.component.html',
  styleUrl: './collateral-type-list.component.scss'
})
export class CollateralTypeListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'status', 'actions'];
  dataSource = new MatTableDataSource<CollateralType>();
  loading = true;
  errorMessage: string | null = null;
  showDeleted = false;
  branchId: number | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private collateralService: CollateralTypeService, private dialog: MatDialog, private userService: UserService) {}

  ngOnInit(): void {
    this.loadCurrentUserBranch();
  }

  loadCurrentUserBranch(): void {
    this.userService.currentUser$.subscribe({
      next: (user) => {
        this.branchId = user?.branchId || null;
        this.loadCollateralTypes();
      },
      error: (error) => {
        console.error('Failed to load user branch', error);
        this.loadCollateralTypes(); // Still load CIFs without branch filter
      }
    });

    // If user data isn't loaded yet, trigger a refresh
    if (!this.userService.currentUserSubject.value) {
      this.userService.getCurrentUser().subscribe();
    }
  }

  loadCollateralTypes(): void {
    this.loading = true;
    const serviceCall = this.showDeleted
        ? this.collateralService.getActiveCollateralTypes()
        : this.collateralService.getDeletedCollateralTypes();

    serviceCall.subscribe({
        next: (data) => {
            this.dataSource.data = data;
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.loading = false;
        },
        error: (err) => {
            this.errorMessage = `Failed to load collateral types: ${err.message}`;
            this.loading = false;
        }
    });
}

  toggleDeletedList(): void {
    this.showDeleted = !this.showDeleted;
    this.loadCollateralTypes(); // Reload data after toggle
}

applyFilter(event: Event): void {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
  }
}


  editCollateralType(row: CollateralType): void {
    const dialogRef = this.dialog.open(CollateralTypeEditComponent, {
      width: '500px',
      data: { ...row } // Pass a copy of the row data
    });

    dialogRef.afterClosed().subscribe((updatedCollateralType: CollateralType) => {
      if (updatedCollateralType) {
        this.collateralService.updateCollateralType(updatedCollateralType.id!, updatedCollateralType).subscribe({
          next: (response) => {
            const index = this.dataSource.data.findIndex(item => item.id === response.id);
            if (index !== -1) {
              this.dataSource.data[index] = response;
              this.dataSource.data = [...this.dataSource.data]; // Trigger table update
            }
          },
          error: (err) => this.errorMessage = `Update failed: ${err.message}`
        });
      }
    });
  }

  deleteCollateralType(id: number): void {
    if (confirm('Are you sure you want to delete this collateral type?')) {
      this.collateralService.softDeleteCollateralType(id).subscribe({
        next: () => this.loadCollateralTypes(),
        error: (err) => this.errorMessage = `Delete failed: ${err.message}`
      });
    }
  }

  restoreCollateralType(id: number): void {
    if (confirm('Are you sure you want to restore this collateral type?')) {
      this.collateralService.restoreCollateralType(id).subscribe({
        next: () => this.loadCollateralTypes(),
        error: (err) => this.errorMessage = `Restore failed: ${err.message}`
      });
    }
  }
}
