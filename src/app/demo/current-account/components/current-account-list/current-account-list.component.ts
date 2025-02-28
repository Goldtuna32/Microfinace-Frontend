import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CurrentAccountComponent } from '../current-account/current-account.component';
import { CurrentAccountService } from '../../services/current-account.service';
import { MatDialog } from '@angular/material/dialog';
import { MatCell, MatHeaderCell, MatHeaderRow, MatRow, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTable } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

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
  imports: [ CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './current-account-list.component.html',
  styleUrl: './current-account-list.component.scss'
})
export class CurrentAccountListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'accountNumber', 'balance', 'status', 'dateCreated', 'cifId', 'actions'];
  dataSource = new MatTableDataSource<CurrentAccount>([]);
  loading = true;
  errorMessage = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private currentAccountService: CurrentAccountService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadCurrentAccounts();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  

  loadCurrentAccounts() {
    this.currentAccountService.getAllCurrentAccounts().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.loading = false;

        // Assign paginator and sort if they are already initialized
        if (this.paginator && this.sort) {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      error: (error) => {
        this.errorMessage = 'Failed to load current accounts.';
        console.error('Error fetching current accounts:', error);
        this.loading = false;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // Ensure filtered results show from the first page
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editCurrentAccount(account: any) {
    const dialogRef = this.dialog.open(CurrentAccountComponent, {
      width: '400px',
      data: { ...account }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCurrentAccounts();  // Reload the current accounts after editing
      }
    });
  }

  deleteCurrentAccount(id: number) {
    if (confirm('Are you sure you want to delete this Current Account?')) {
      this.currentAccountService.deleteCurrentAccount(id).subscribe({
        next: () => {
          alert('Current Account deleted successfully.');
          this.loadCurrentAccounts();  // Reload the current accounts after deleting
        },
        error: (error) => {
          alert('Failed to delete Current Account.');
          console.error('Error deleting Current Account:', error);
        }
      });
    }
  }
}
