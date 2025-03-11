import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CifService } from '../../services/cif.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CifEditComponent } from '../cif-edit/cif-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { CurrentAccountComponent } from 'src/app/demo/current-account/components/current-account/current-account.component';
import { CurrentAccountService } from 'src/app/demo/current-account/services/current-account.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CifDetailModalComponent } from '../cif-detail-modal/cif-detail-modal.component';
import { CIF } from '../../models/cif.model';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cif-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatMenuModule,
    MatButtonModule
  ],
  templateUrl: './cif-list.component.html',
  styleUrls: ['./cif-list.component.scss']
})
export class CifListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['SerialNumber', 'name', 'nrcNumber', 'dob', 'phoneNumber', 'email', 'actions'];
  dataSource = new MatTableDataSource<CIF>([]);
  loading = true;
  errorMessage = '';
  isDeletedView = false;
  fullCifList: CIF[] = [];
  currentPage = 1; // Start at page 1
  pageSize = 10; // Default page size
  totalPages = 0; // Calculated based on full list length

  @ViewChild(MatSort) sort!: MatSort;

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

  loadCIFs() {
    this.loading = true;
    this.errorMessage = '';

    const cifObservable = this.isDeletedView
      ? this.cifService.getDeletedCIFs()
      : this.cifService.getAllCIFs();

    cifObservable.subscribe({
      next: (cifList: CIF[]) => {
        console.log('✅ API Response:', cifList);
        if (!cifList || cifList.length === 0) {
          console.warn('⚠️ No CIFs found in response');
          this.dataSource.data = [];
          this.fullCifList = [];
          this.errorMessage = 'No CIFs found.';
          this.totalPages = 0;
        } else {
          this.fullCifList = cifList;
          this.totalPages = Math.ceil(this.fullCifList.length / this.pageSize);
          this.updatePaginatedData(); // Set initial page
          // Check current account status for each CIF
          this.fullCifList.forEach(cif => this.checkCurrentAccount(cif));
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ API Error:', error);
        this.loading = false;
        this.errorMessage = 'Failed to load CIF list.';
        this.dataSource.data = [];
        this.fullCifList = [];
        this.totalPages = 0;
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;

    this.sort.sortChange.subscribe(() => {
      this.dataSource.sort = this.sort;
      this.currentPage = 1; // Reset to first page on sort
      this.updatePaginatedData();
    });
  }

  private updatePaginatedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.fullCifList.length);
    this.dataSource.data = this.fullCifList.slice(startIndex, endIndex);
  }

  toggleView() {
    this.isDeletedView = !this.isDeletedView;
    this.currentPage = 1; // Reset to first page
    this.loadCIFs();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    this.currentPage = 1; // Reset to first page on filter
    this.updatePaginatedData();
  }

  // Pagination controls
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedData();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedData();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedData();
    }
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Check if CIF has a current account
  checkCurrentAccount(cif: CIF) {
    this.currentAccountService.hasCurrentAccount(cif.id).subscribe({
      next: (hasAccount: boolean) => {
        cif.hasCurrentAccount = hasAccount; // Update CIF object
      },
      error: (error) => {
        console.error(`Failed to check current account for CIF ${cif.id}:`, error);
        cif.hasCurrentAccount = false; // Default to false on error
      }
    });
  }

  editCIF(cif: CIF) {
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

  downloadReport(format: string) {
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

  openCurrentAccountDialog(row: CIF) {
    if (row.hasCurrentAccount) return; // Do nothing if account already exists
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

  restoreCIF(id: number) {
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

  deleteCIF(id: number) {
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

  openCifDetailDialog(cif: CIF) {
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