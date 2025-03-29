import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollateralService } from '../../services/collateral.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CollateralDetailComponent } from '../collateral-detail/collateral-detail.component';
import { MatDialog } from '@angular/material/dialog';
import { Collateral } from '../../models/collateral.model';
import { MatTableModule } from '@angular/material/table';
import { CollateralEditComponent } from '../collateral-edit/collateral-edit.component';

@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 50): string {
    if (!value) return '';
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }
}


@Component({
  selector: 'app-collateral-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule],
  templateUrl: './collateral-list.component.html',
  styleUrls: ['./collateral-list.component.scss'] // Fixed styleUrl to styleUrls
})
export class CollateralListComponent implements OnInit {
  collaterals: Collateral[] = [];
  paginatedCollaterals: Collateral[] = [];
  loading: boolean = true;
  error: string | null = null;
  currentPage: number = 1;
  pageSize: number = 5; // Default page size
  sortColumn: keyof Collateral | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  showDeleted = false;
  totalItems: number = 0;
  itemsPerPage: number = 5;

  
  // Expose Math to template
  Math = Math;

  constructor(
    private collateralService: CollateralService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCollaterals();
  }

  loadCollaterals(): void {
    this.loading = true;
    const serviceCall = this.showDeleted
      ? this.collateralService.getDeletedCollaterals()
      : this.collateralService.getAllCollaterals();
  
    serviceCall.subscribe({
      next: (response: { content: Collateral[]; totalPages: number; totalElements: number }) => {
        this.collaterals = response.content;
        this.totalItems = response.totalElements;
        this.updatePagination();
        this.loading = false;
        this.error = null;
      },
      error: (error) => {
        this.error = 'Error loading collaterals. Please try again later.';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  // ... rest of your existing methods remain the same ...
  toggleDeletedList(): void {
    this.showDeleted = !this.showDeleted;
    this.currentPage = 1; // Reset pagination
    this.sortColumn = null; // Reset sorting
    this.loadCollaterals();
  }

  sort(column: keyof Collateral): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.collaterals.sort((a, b) => {
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
    this.paginatedCollaterals = this.collaterals.slice(start, end);
  }

  // Pagination Methods
  getTotalPages(): number {
    return Math.ceil(this.collaterals.length / this.pageSize);
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    return Array.from({ length: totalPages }, (_, i) => i + 1);
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

  openDetailPage(collateral: Collateral): void {
    // Check if collateral and collateral.id exists
    if (collateral && collateral.id) {
      // Use relative navigation since you're using child routes
      this.router.navigate([collateral.id], { relativeTo: this.route });
      
      // OR if you want absolute path navigation:
      // this.router.navigate(['/your-parent-route/collaterals', collateral.id]);
    } else {
      console.error('Collateral or collateral ID is missing');
    }
  }
  editCollateral(collateral: Collateral): void {
    const dialogRef = this.dialog.open(CollateralEditComponent, {
      width: '600px',
      maxHeight: '90vh',
      data: { ...collateral }
    });

    dialogRef.afterClosed().subscribe((updatedCollateral: FormData) => {
      if (updatedCollateral) {
        const id = updatedCollateral.get('id');
        if (!id || isNaN(Number(id))) {
          console.error('Invalid ID from FormData:', id);
          alert('Failed to update Collateral: Invalid ID.');
          return;
        }

        const updatedCollateralData: any = {};
        updatedCollateral.forEach((value, key) => {
          updatedCollateralData[key] = value;
        });

        this.collateralService.updateCollateral(Number(id), updatedCollateral).subscribe({
          next: () => {
            const index = this.collaterals.findIndex(item => item.id === Number(id));
            if (index !== -1) {
              this.collaterals[index] = updatedCollateralData;
              this.updatePagination();
            }
            alert('Collateral updated successfully!');
          },
          error: (error) => {
            alert('Failed to update Collateral.');
            console.error('Error updating Collateral:', error);
          }
        });
      }
    });
  }

  deleteCollateral(id: number | undefined): void {
    if (id === undefined || !confirm('Are you sure you want to delete this collateral?')) return;
    this.collateralService.deleteCollateral(id).subscribe({
      next: () => {
        this.collaterals = this.collaterals.filter(c => c.id !== id);
        this.updatePagination();
      },
      error: (error) => {
        this.error = 'Error deleting collateral.';
        console.error('Delete error:', error);
      }
    });
  }

  restoreCollateral(id: number | undefined): void {
    if (id === undefined || !confirm('Are you sure you want to restore this collateral?')) return;
    this.collateralService.restoreCollateral(id).subscribe({
      next: () => {
        this.collaterals = this.collaterals.filter(c => c.id !== id);
        this.updatePagination();
      },
      error: (error) => {
        this.error = 'Error restoring collateral.';
        console.error('Restore error:', error);
      }
    });
  }
}