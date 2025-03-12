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

export interface CurrentAccount {
  id: number;
  accountNumber: string;
  balance: number;
  status: number;
  dateCreated: string;
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
  templateUrl: './current-account-list.component.html',
  styleUrl: './current-account-list.component.scss'
})
export class CurrentAccountListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'accountNumber', 'balance', 'status', 'dateCreated', 'cifId', 'actions'];
  dataSource = new MatTableDataSource<CurrentAccount>([]);
  loading = true;
  errorMessage = '';
  
  // Pagination properties
  currentPage = 1;
  pageSize = 10; // You can adjust this value
  totalItems = 0;
  totalPages = 0;
  allData: CurrentAccount[] = []; // Store all data for pagination

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private currentAccountService: CurrentAccountService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCurrentAccounts();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  loadCurrentAccounts(): void {
    this.currentAccountService.getAllCurrentAccounts().subscribe({
      next: (data) => {
        this.allData = data; // Store all data
        this.totalItems = data.length;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.updatePaginatedData();
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load current accounts.';
        console.error('Error fetching current accounts:', error);
        this.loading = false;
      }
    });
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