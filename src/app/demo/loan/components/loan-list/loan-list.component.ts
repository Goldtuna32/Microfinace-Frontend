import { Component, ElementRef, HostListener, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { LoanService } from '../../services/loan.service';
import { SmeLoanRegistration } from '../../models/SmeLoanRegistration.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTab, MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatMenu, MatMenuModule, MatMenuTrigger } from '@angular/material/menu';

declare const bootstrap: any;

@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 10): string {
    if (!value) return '';
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }
}

@Component({
  selector: 'app-loan-list',
  imports: [MatTableModule, CommonModule,MatCardModule, MatTabsModule, MatMenuModule],
  templateUrl: './loan-list.component.html',
  styleUrl: './loan-list.component.scss'
})
export class LoanListComponent implements OnInit{
  @ViewChild('pendingTab') pendingTab!: ElementRef<HTMLButtonElement>;
  @ViewChild('approvedTab') approvedTab!: ElementRef<HTMLButtonElement>;

  pendingLoansDataSource = new MatTableDataSource<SmeLoanRegistration>();
  approvedLoansDataSource = new MatTableDataSource<SmeLoanRegistration>();
  displayedColumns: string[] = [
    'id', 'loanAmount', 'interestRate', 'gracePeriod', 'repaymentDuration',
    'documentFee', 'serviceCharges', 'currentAccountId', 'late_fee_rate',
    'ninety_day_late_fee_rate', 'one_hundred_and_eighty_day_late_fee_rate', 'actions',
  ];
  errorMessage: string | null = null;

  pendingPageIndex = 0;
  pendingPageSize = 5;
  approvedPageIndex = 0;
  approvedPageSize = 5;

  constructor(private loanService: LoanService, private router: Router) {}

  ngOnInit(): void {
    this.loadPendingLoans();
    this.loadApprovedLoans();
  }

  ngAfterViewInit(): void {
    if (this.pendingTab) {
      const tab = new bootstrap.Tab(this.pendingTab.nativeElement);
      tab.show();
    }
  }

  loadPendingLoans(): void {
    this.loanService.getPendingLoans().subscribe({
      next: (loans) => {
        console.log('Pending Loans Data:', loans);
        this.pendingLoansDataSource.data = loans.length ? loans : [];
        this.pendingPageIndex = 0;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load pending loans: ' + error.message;
        console.error('Pending Loans Error:', error);
      },
    });
  }

  loadApprovedLoans(): void {
    this.loanService.getApprovedLoans().subscribe({
      next: (loans) => {
        console.log('Approved Loans Data:', loans);
        this.approvedLoansDataSource.data = loans.length ? loans : [];
        this.approvedPageIndex = 0;
        if (!loans.length) {
          console.warn('No approved loans returned from the server.');
        }
      },
      error: (error) => {
        this.errorMessage = 'Failed to load approved loans: ' + error.message;
        console.error('Approved Loans Error:', error);
        this.approvedLoansDataSource.data = [];
        this.approvedPageIndex = 0;
      },
    });
  }

  switchToTab(tab: 'pending' | 'approved'): void {
    const tabElement = tab === 'pending' ? this.pendingTab : this.approvedTab;
    if (tabElement) {
      const bsTab = new bootstrap.Tab(tabElement.nativeElement);
      bsTab.show();
      console.log(`Switched to ${tab} tab`);
    } else {
      console.error(`${tab} tab element not found`);
    }
  }

  approveLoan(loan: SmeLoanRegistration): void {
    this.loanService.approveLoan(loan.id!).subscribe({
      next: () => {
        this.loadPendingLoans();
        this.loadApprovedLoans();
      },
      error: (error) => (this.errorMessage = 'Failed to approve loan: ' + error.message),
    });
  }

  viewDetails(loan: SmeLoanRegistration): void {
    this.router.navigate(['/loans', loan.id]);
  }

  editLoan(loan: SmeLoanRegistration): void {
    this.router.navigate(['/loans', loan.id, 'edit']);
  }

  showRepaymentSchedule(loan: SmeLoanRegistration): void {
    this.router.navigate(['/loans', loan.id, 'repayment-schedule']);
  }

  deleteLoan(loan: SmeLoanRegistration): void {
    console.log('Delete loan:', loan);
  }

  getPendingTotalPages(): number {
    return Math.ceil(this.pendingLoansDataSource.data.length / this.pendingPageSize);
  }

  getPendingPages(): number[] {
    return Array.from({ length: this.getPendingTotalPages() }, (_, i) => i);
  }

  getApprovedTotalPages(): number {
    return Math.ceil(this.approvedLoansDataSource.data.length / this.approvedPageSize);
  }

  getApprovedPages(): number[] {
    return Array.from({ length: this.getApprovedTotalPages() }, (_, i) => i);
  }

  isDropdownOpen = false;

  toggleDropdown(dropdown: HTMLElement): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

   
}
