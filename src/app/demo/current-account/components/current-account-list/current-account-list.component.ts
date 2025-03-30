// current-account-list.component.ts
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CurrentAccountComponent } from '../current-account/current-account.component';
import { CurrentAccountService } from '../../services/current-account.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { UserService } from 'src/app/demo/users/services/user.service';

export interface CurrentAccount {
  id: number;
  
  accountNumber: string;
  balance: number;
  status: number;
  dateCreated: Date;  // Changed from string to Date
  holdAmount: number;
  cifId: number;
  maximumBalance: number;
  minimumBalance: number;
}

@Component({
  selector: 'app-current-account-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    SharedModule
  ],
  standalone: true,
  templateUrl: './current-account-list.component.html',
  styleUrl: './current-account-list.component.scss'
})
export class CurrentAccountListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'accountNumber', 'balance', 'status', 'dateCreated', 'cifId', 'actions'];
  dataSource = new MatTableDataSource<CurrentAccount>([]);
  loading = true;
  branchId: number | null = null;
  errorMessage = '';
  showSuccessAlert: boolean = false;
  currentAccounts: CurrentAccount[] = [];
filteredCurrentAccounts: CurrentAccount[] = [];
  // Pagination properties
  currentPage = 1;
  pageSize = 10; // You can adjust this value
  totalItems = 0;
  totalPages = 0;
  allData: CurrentAccount[] = []; // Store all data for pagination
  filteredData: CurrentAccount[] = []; // Store filtered data
  isDeletedView = false;

  // Filter properties
  currentSearchTerm = '';
  currentStatusFilter: number | null = null;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private currentAccountService: CurrentAccountService,
    private dialog: MatDialog,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCurrentUserBranch();
  
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['success']) {
      this.showSuccessAlert = true;
      setTimeout(() => {
        this.showSuccessAlert = false;
      }, 5000);
    }
  }

  loadCurrentUserBranch(): void {
    this.userService.currentUser$.subscribe({
      next: (user) => {
        this.branchId = user?.branchId || null;
        this.loadCurrentAccounts();
      },
      error: (error) => {
        console.error('Failed to load user branch', error);
        this.loadCurrentAccounts(); // Still load CIFs without branch filter
      }
    });

    // If user data isn't loaded yet, trigger a refresh
    if (!this.userService.currentUserSubject.value) {
      this.userService.getCurrentUser().subscribe();
    }
  }

  loadBranchId(): void {
    // Get branch ID from service or localStorage
    const storedBranch = localStorage.getItem('currentBranch');
    this.branchId = storedBranch ? JSON.parse(storedBranch).id : null;
    this.loadCurrentAccounts();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  loadCurrentAccounts(showActive: boolean = true, branchId?: number): void {
    console.log('Loading accounts with branchId:', branchId);
    this.loading = true;
    this.errorMessage = '';

    const currentAccountObservable = showActive
        ? this.currentAccountService.getAllCurrentAccountByBranch(branchId)
        : this.currentAccountService.getFreezeCurrentAccountByBranch(branchId);

    currentAccountObservable.subscribe({
        next: (data: any[]) => {
            console.log('Raw API data:', data);
            
            // Convert data to match CurrentAccount interface
            this.currentAccounts = data.map(item => ({
                ...item,
                dateCreated: new Date(item.dateCreated) // Convert string to Date
            }));

            console.log('Processed accounts:', this.currentAccounts);
            
            // Initialize MatTableDataSource
            this.dataSource = new MatTableDataSource(this.currentAccounts);
            this.dataSource.sort = this.sort;
            
            // Initialize filtered data for your custom pagination
            this.filteredCurrentAccounts = [...this.currentAccounts];
            this.allData = [...this.currentAccounts];
            
            this.loading = false;
        },
        error: (error) => {
            console.error('Error loading accounts:', error);
            this.errorMessage = 'Failed to load current accounts. Please try again.';
            this.loading = false;
        }
    });
}

private updatePagination(totalItems: number): void {
  this.totalItems = totalItems;
  this.totalPages = Math.ceil(totalItems / this.pageSize);
  this.updatePaginatedData();
}

  applyAllFilters(): void {
    this.filteredData = [...this.allData];
    
    // Apply status filter if active
    if (this.currentStatusFilter !== null) {
      this.filteredData = this.filteredData.filter(account => account.status === this.currentStatusFilter);
    }
    
    // Apply search filter if active
    if (this.currentSearchTerm) {
      const searchTerm = this.currentSearchTerm.toLowerCase();
      this.filteredData = this.filteredData.filter(account => 
        account.accountNumber.toLowerCase().includes(searchTerm) ||
        account.cifId.toString().includes(searchTerm)
      );
    }
    
    // Update pagination
    this.totalItems = this.filteredData.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.currentPage = 1; // Reset to first page
    this.updatePaginatedData();
  }

  filterByStatus(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const statusValue = selectElement.value;
    
    if (statusValue === '') {
      this.currentStatusFilter = null;
    } else {
      this.currentStatusFilter = parseInt(statusValue, 10);
    }
    
    this.applyAllFilters();
  }

  // New method to reset all filters
  resetFilters(): void {
    this.currentSearchTerm = '';
    this.currentStatusFilter = null;
    this.applyAllFilters();
    
    // Reset the search input field if needed
    const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = '';
    }
    
    // Reset the status dropdown
    const statusSelect = document.querySelector('select') as HTMLSelectElement;
    if (statusSelect) {
      statusSelect.value = '';
    }
  }


  updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.dataSource.data = this.allData.slice(startIndex, endIndex);
  }

  getPageNumbers(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedData();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedData();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedData();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    
    // Filter the full dataset and update pagination
    this.allData = this.dataSource.filteredData;
    this.totalItems = this.allData.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.currentPage = 1; // Reset to first page
    this.updatePaginatedData();
  }

  navigateToTransactionHistory(accountId: number): void {
    this.router.navigate(['/transaction-history', accountId]);
  }

  editCurrentAccount(account: any): void {
    const dialogRef = this.dialog.open(CurrentAccountComponent, {
      width: '400px',
      data: { ...account }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCurrentAccounts();
      }
    });
  }

  deleteCurrentAccount(id: number): void {
    if (confirm('Are you sure you want to delete this Current Account?')) {
      this.currentAccountService.deleteCurrentAccount(id).subscribe({
        next: () => {
          alert('Current Account deleted successfully.');
          this.loadCurrentAccounts();
        },
        error: (error) => {
          alert('Failed to delete Current Account.');
          console.error('Error deleting Current Account:', error);
        }
      });
    }
  }
}