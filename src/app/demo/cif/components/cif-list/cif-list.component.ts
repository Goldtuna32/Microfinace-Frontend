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
  import { FlowbiteService } from 'src/app/flowbite services/flowbit.service';
  import {initFlowbite} from "flowbite";
  import { AlertService } from 'src/app/alertservice/alert.service';
  import { BranchService } from 'src/app/demo/branch/services/branch.service';
import { AuthService } from 'src/app/auth/auth.service';
import { UserService } from 'src/app/demo/users/services/user.service';

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
    branchId: number | null = null;
    errorMessage = '';
    isDeletedView = false;
    showSuccessAlert: boolean = false;

    Math = Math;
    activeCount: number = 0;
incompleteCount: number = 0;
deletedCount: number = 0;
searchQuery: string = '';

    // Client-side pagination variables
    pageSize = 10;
    currentPage = 0;
    totalItems = 0;
    paginatedData: CIF[] = [];

    // Filter variable
    nrcFilter: string = '';

    constructor(
      private cifService: CifService,
      private router: Router,
      private dialog: MatDialog,
      private currentAccountService: CurrentAccountService,
      private http: HttpClient,
      private alertService: AlertService,
      private branchService: BranchService,
      private authService: UserService
    ) {}

    ngOnInit(): void {
      this.loadCurrentUserBranch();
      document.addEventListener('click', this.handleDocumentClick.bind(this));
    
      const navigation = this.router.getCurrentNavigation();
      if (navigation?.extras.state?.['success']) {
        this.showSuccessAlert = true;
        setTimeout(() => {
          this.showSuccessAlert = false;
        }, 5000);
      }
    }

    ngOnDestroy(): void {
      document.removeEventListener('click', this.handleDocumentClick.bind(this));
    }

    handleDocumentClick(event: MouseEvent): void {
      if (!(event.target as Element).closest('.dropdown')) {
        this.closeDropdowns();
      }
    }
  

    loadCurrentUserBranch(): void {
      this.authService.currentUser$.subscribe({
        next: (user) => {
          this.branchId = user?.branchId || null;
          this.loadCIFs();
        },
        error: (error) => {
          console.error('Failed to load user branch', error);
          this.loadCIFs(); // Still load CIFs without branch filter
        }
      });
  
      // If user data isn't loaded yet, trigger a refresh
      if (!this.authService.currentUserSubject.value) {
        this.authService.getCurrentUser().subscribe();
      }
    }

    loadBranchId(): void {
      // Get branch ID from service or localStorage
      const storedBranch = localStorage.getItem('currentBranch');
      this.branchId = storedBranch ? JSON.parse(storedBranch).id : null;
      this.loadCIFs();
    }

    applySearch(): void {
      // Your search implementation
      this.loadCIFs();
    }

    
clearSearch(): void {
  this.searchQuery = '';
  this.applySearch();
}

    dismissAlert() {
      this.showSuccessAlert = false;
    }

    loadCIFs(): void {
      this.loading = true;
      this.errorMessage = '';
    
      const cifObservable = this.isDeletedView
        ? this.cifService.getDeletedCIFs(this.branchId ?? undefined, this.nrcFilter || undefined)
        : this.cifService.getAllCIFs(this.branchId ?? undefined, this.nrcFilter || undefined);
    
      cifObservable.subscribe({
        next: (cifs: CIF[]) => {
          this.dataSource.data = cifs;
          this.totalItems = cifs.length;
          this.updatePaginatedData();
          this.loading = false;
    
          this.dataSource.data.forEach(cif => this.checkCurrentAccount(cif));
        },
        error: (error) => {
          this.alertService.showError("Failed to load CIF List");
          this.loading = false;
          this.errorMessage = 'Failed to load CIF list.';
          this.dataSource.data = [];
          this.totalItems = 0;
        }
      });
    }

    // Client-side pagination
    updatePaginatedData(): void {
      const startIndex = this.currentPage * this.pageSize;
      this.paginatedData = this.dataSource.data.slice(startIndex, startIndex + this.pageSize);
    }

    onPageChange(event: any): void {
      this.currentPage = event.pageIndex;
      this.pageSize = event.pageSize;
      this.updatePaginatedData();
    }

    // Update your toggle method to handle positioning
toggleDropdown(event: MouseEvent, cifId: number): void {
  event.stopPropagation();
  
  // Close all other dropdowns first
  this.closeDropdowns();
  
  // Find the clicked row
  const clickedRow = this.dataSource.data.find(item => item.id === cifId);
  if (clickedRow) {
    clickedRow.isDropdownOpen = true;
    
    // Optional: Scroll into view if near bottom
    setTimeout(() => {
      const dropdownElement = (event.target as HTMLElement).closest('td')?.querySelector('.dropdown-menu');
      if (dropdownElement) {
        const rect = dropdownElement.getBoundingClientRect();
        if (rect.bottom > window.innerHeight) {
          dropdownElement.scrollIntoView({ block: 'nearest' });
        }
      }
    });
  }
}
    
    isDropdownActive(cifId: number): boolean {
      const cif = this.dataSource.data.find(item => item.id === cifId);
      return cif?.isDropdownOpen || false;
    }
    
    closeDropdowns(): void {
      this.dataSource.data.forEach(item => {
        item.isDropdownOpen = false;
      });
    }
  
    
    toggleView(): void {
      this.isDeletedView = !this.isDeletedView;
      this.currentPage = 0;
      this.loadCIFs();
    }

    applyFilter(): void {
      this.currentPage = 0;
      this.loadCIFs();
    }

    clearFilter(): void {
      this.nrcFilter = '';
      this.currentPage = 0;
      this.loadCIFs();
    }

    
    
    get totalPages(): number {
      return Math.ceil(this.totalItems / this.pageSize);
    }

    getPageNumbers(): number[] {
      return Array(this.totalPages).fill(0).map((_, i) => i + 1);
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

    // ... rest of your methods (editCIF, downloadReport, etc.) remain the same ...
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

    openCifDetail(cif: CIF): void {
      this.router.navigate(['/cif-detail', cif.id]);
    }

    getStatusText(status: number): string {
      switch(status) {
        case 1: return 'Active';
        case 2: return 'Deleted';
        case 3: return 'Pending';
        default: return 'Unknown';
      }
    }
    
    getPages(): number[] {
      const totalPages = Math.ceil(this.dataSource.data.length / this.pageSize);
      return Array.from({length: totalPages}, (_, i) => i);
    }
    
    getLastPage(): number {
      return Math.ceil(this.dataSource.data.length / this.pageSize) - 1;
    }
    
    previousPage(): void {
      if (this.currentPage > 0) {
        this.currentPage--;
      }
    }
    
    nextPage(): void {
      if (this.currentPage < this.getLastPage()) {
        this.currentPage++;
      }
    }
    
    goToPage(page: number): void {
      this.currentPage = page;
    }
  }