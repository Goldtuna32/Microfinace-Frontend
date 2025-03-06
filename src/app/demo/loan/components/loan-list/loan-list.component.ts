import { Component, OnInit, ViewChild } from '@angular/core';
import { LoanService } from '../../services/loan.service';
import { SmeLoanRegistration } from '../../models/SmeLoanRegistration.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTab, MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatMenu, MatMenuModule, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-loan-list',
  imports: [MatTableModule, CommonModule,MatCardModule, MatTab, MatTabsModule, MatPaginator, MatMenuTrigger, MatMenu, MatMenuModule],
  templateUrl: './loan-list.component.html',
  styleUrl: './loan-list.component.scss'
})
export class LoanListComponent implements OnInit{
  pendingLoansDataSource = new MatTableDataSource<SmeLoanRegistration>();
  approvedLoansDataSource = new MatTableDataSource<SmeLoanRegistration>();
  displayedColumns: string[] = [
    'id',
    'loanAmount',
    'interestRate',
    'gracePeriod',
    'repaymentDuration',
    'documentFee',
    'serviceCharges',
    'currentAccountId',
    'actions'
  ];
  errorMessage: string | null = null;

  @ViewChild('pendingPaginator') pendingPaginator!: MatPaginator;
  @ViewChild('approvedPaginator') approvedPaginator!: MatPaginator;

  constructor(private loanService: LoanService, private router: Router) {}

  ngOnInit(): void {
    this.loadPendingLoans();
    this.loadApprovedLoans();
  }

  ngAfterViewInit(): void {
    this.pendingLoansDataSource.paginator = this.pendingPaginator;
    this.approvedLoansDataSource.paginator = this.approvedPaginator;
  }

  loadPendingLoans(): void {
    this.loanService.getPendingLoans().subscribe({
      next: (loans) => {
        this.pendingLoansDataSource.data = loans;
      },
      error: (error) => this.errorMessage = 'Failed to load pending loans: ' + error.message
    });
  }

  loadApprovedLoans(): void {
    this.loanService.getApprovedLoans().subscribe({
      next: (loans) => {
        this.approvedLoansDataSource.data = loans;
      },
      error: (error) => this.errorMessage = 'Failed to load approved loans: ' + error.message
    });
  }

  approveLoan(loan: SmeLoanRegistration): void {
    this.loanService.approveLoan(loan.id!).subscribe({
      next: () => {
        this.loadPendingLoans();
        this.loadApprovedLoans();
      },
      error: (error) => this.errorMessage = 'Failed to approve loan: ' + error.message
    });
  }

  viewDetails(loan: SmeLoanRegistration): void {
    this.router.navigate(['/loans', loan.id]);
  }

editLoan(loan: SmeLoanRegistration): void {
  this.router.navigate(['/loans', loan.id, 'edit']);
}

  deleteLoan(loan: SmeLoanRegistration): void {
    console.log('Delete loan:', loan); // Placeholder
  }
}
