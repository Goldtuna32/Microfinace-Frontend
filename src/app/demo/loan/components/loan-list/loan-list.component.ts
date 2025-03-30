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
import { UserService } from 'src/app/demo/users/services/user.service';
import { AlertService } from 'src/app/alertservice/alert.service';

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
  dataSource = new MatTableDataSource<SmeLoanRegistration>([]);
  loading = true;
  errorMessage = '';
  isDeletedView = false;
  branchId: number | null = null;
  totalItems = 0;
  showSuccessAlert: boolean = false;

  pendingLoansDataSource = new MatTableDataSource<SmeLoanRegistration>();
  approvedLoansDataSource = new MatTableDataSource<SmeLoanRegistration>();
  displayedColumns: string[] = [
    'id', 'loanAmount', 'interestRate', 'gracePeriod', 'repaymentDuration',
    'documentFee', 'serviceCharges', 'currentAccountId', 'late_fee_rate',
    'ninety_day_late_fee_rate', 'one_hundred_and_eighty_day_late_fee_rate', 'actions',
  ];
 
  pendingPageIndex = 0;
  pendingPageSize = 5;
  approvedPageIndex = 0;
  approvedPageSize = 5;

  constructor(private loanService: LoanService, private router: Router, private userService: UserService,
    private alertService: AlertService) {}

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
        this.loadPendingLoans();
        this.loadApprovedLoans();
      },
      error: (error) => {
        console.error('Failed to load user branch', error);
        this.loadPendingLoans(); // Still load CIFs without branch filter
        this.loadApprovedLoans();
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
    console.log("Branch ID" , this.branchId)
    this.branchId = storedBranch ? JSON.parse(storedBranch).id : null;
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
    this.loanService.getAllPendingLoans(this.branchId ?? undefined).subscribe({
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
    this.loanService.getAllApprovedLoans(this.branchId ?? undefined).subscribe({
      next: (loans) => {
        console.log('Approved Loans Data:', loans);
        this.approvedLoansDataSource.data = loans.length ? loans : [];
        this.approvedPageIndex = 0;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load approved loans: ' + error.message;
        console.error('Approved Loans Error:', error);
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
