import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CifService, PageResponse } from '../../services/cif.service';
import { CIF } from '../../models/cif.model';
import { CifEditComponent } from '../cif-edit/cif-edit.component';
import { CifDetailModalComponent } from '../cif-detail-modal/cif-detail-modal.component';
import { CurrentAccountComponent } from 'src/app/demo/current-account/components/current-account/current-account.component';
import { CurrentAccountService } from 'src/app/demo/current-account/services/current-account.service';
import { HttpClient } from '@angular/common/http';

// Standalone imports
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cif-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    FormsModule
  ],
  templateUrl: './cif-list.component.html',
  styleUrls: ['./cif-list.component.scss']
})
export class CifListComponent implements OnInit {
  displayedColumns: string[] = ['SerialNumber', 'name', 'nrcNumber', 'dob', 'phoneNumber', 'email', 'actions'];
  dataSource = new MatTableDataSource<CIF>([]);
  loading = true;
  errorMessage = '';
  isDeletedView = false;

  // Pagination variables
  pageSize = 10;
  currentPage = 0; // 0-based for backend
  totalElements = 0;
  totalPages = 0;

  // Filter variable
  nrcFilter: string = '';

  constructor(
    private cifService: CifService,
    private router: Router,
    private dialog: MatDialog,
    private currentAccountService: CurrentAccountService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadCIFs();
  }

  loadCIFs(): void {
    this.loading = true;
    this.errorMessage = '';

    const cifObservable = this.isDeletedView
      ? this.cifService.getDeletedCIFs(this.currentPage, this.pageSize, this.nrcFilter || undefined)
      : this.cifService.getAllCIFs(this.currentPage, this.pageSize, this.nrcFilter || undefined);

    cifObservable.subscribe({
      next: (response: PageResponse<CIF>) => {
        this.dataSource.data = response.content;
        this.totalElements = response.page.totalElements;
        this.totalPages = response.page.totalPages;
        this.loading = false;

        // Check current account status for each CIF
        this.dataSource.data.forEach(cif => this.checkCurrentAccount(cif));
      },
      error: (error) => {
        console.error('❌ API Error:', error);
        this.loading = false;
        this.errorMessage = 'Failed to load CIF list.';
        this.dataSource.data = [];
        this.totalElements = 0;
        this.totalPages = 0;
      }
    });
  }

  toggleView(): void {
    this.isDeletedView = !this.isDeletedView;
    this.currentPage = 0;
    this.loadCIFs();
  }

  applyFilter(): void {
    this.currentPage = 0; // Reset to first page on filter
    this.loadCIFs();
  }

  clearFilter(): void {
    this.nrcFilter = '';
    this.currentPage = 0;
    this.loadCIFs();
  }

  // Pagination methods
  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadCIFs();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadCIFs();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page - 1; // Convert to 0-based index
    this.loadCIFs();
  }

  getPageNumbers(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1); // 1-based for UI
  }

  checkCurrentAccount(cif: CIF): void {
    this.currentAccountService.hasCurrentAccount(cif.id).subscribe({
      next: (hasAccount: boolean) => {
        cif.hasCurrentAccount = hasAccount;
      },
      error: (error) => {
        console.error(`Failed to check current account for CIF ${cif.id}:`, error);
        cif.hasCurrentAccount = false;
      }
    });
  }

  editCIF(cif: CIF): void {
    const dialogRef = this.dialog.open(CifEditComponent, {
      width: '400px',
      data: { ...cif }
    });

    dialogRef.afterClosed().subscribe((updatedCif: FormData) => {
      if (updatedCif) {
        const id = updatedCif.get('id');
        if (!id || isNaN(Number(id))) {
          console.error('Invalid ID from FormData:', id);
          alert('Failed to update CIF: Invalid ID.');
          return;
        }

        this.cifService.updateCIF(Number(id), updatedCif).subscribe({
          next: () => {
            this.loadCIFs();
            alert('CIF updated successfully!');
          },
          error: (error) => {
            alert('Failed to update CIF.');
            console.error('Error updating CIF:', error);
          }
        });
      }
    });
  }

  downloadReport(format: string): void {
    const type = this.isDeletedView ? 'deleted' : 'active';
    const url = `http://localhost:8080/api/reports/cif/${type}/${format}`;
    const fileName = `${type}_cifs_report.${format === 'pdf' ? 'pdf' : 'xlsx'}`;

    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        link.href = url;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        this.errorMessage = `Error downloading ${format.toUpperCase()} report`;
        console.error(error);
      }
    });
  }

  openCurrentAccountDialog(row: CIF): void {
    if (row.hasCurrentAccount) return;
    const dialogRef = this.dialog.open(CurrentAccountComponent, {
      width: '400px',
      data: { cifId: row.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCIFs();
      }
    });
  }

  restoreCIF(id: number): void {
    if (confirm('Are you sure you want to restore this CIF?')) {
      this.cifService.restoreCIF(id).subscribe({
        next: () => {
          alert('CIF restored successfully.');
          this.loadCIFs();
        },
        error: (error) => {
          alert('Failed to restore CIF.');
          console.error('Error restoring CIF:', error);
        }
      });
    }
  }

  deleteCIF(id: number): void {
    if (confirm('Are you sure you want to delete this CIF?')) {
      this.cifService.deleteCIF(id).subscribe({
        next: () => {
          alert('CIF deleted successfully.');
          this.loadCIFs();
        },
        error: (error) => {
          alert('Failed to delete CIF.');
          console.error('Error deleting CIF:', error);
        }
      });
    }
  }

  openCifDetailDialog(cif: CIF): void {
    this.dialog.open(CifDetailModalComponent, {
      width: '90%',
      maxWidth: '900px',
      height: 'auto',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
      data: cif
    });
  }
}