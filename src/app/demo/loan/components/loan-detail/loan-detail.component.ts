import { Component, OnInit } from '@angular/core';
import { SmeLoanRegistration } from '../../models/SmeLoanRegistration.model';
import { ActivatedRoute, Router } from '@angular/router';
import { LoanService } from '../../services/loan.service';
import { CommonModule } from '@angular/common';
import { Collateral } from '../loan-edit/loan-edit.component';
import { CIF } from 'src/app/demo/cif/models/cif.model';

@Component({
  selector: 'app-loan-detail',
  imports: [ CommonModule],
  templateUrl: './loan-detail.component.html',
  styleUrl: './loan-detail.component.scss'
})
export class LoanDetailComponent implements OnInit{
  loan!: SmeLoanRegistration;
  isLoading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loanService: LoanService
  ) { }

  ngOnInit(): void {
    this.loadLoanDetails();
  }

  loadLoanDetails(): void {
    this.isLoading = true;
    const loanId = this.route.snapshot.paramMap.get('id');
    
    if (loanId) {
      this.loanService.getLoanDetails(loanId).subscribe({
        next: (data) => {
          this.loan = data;
          // Ensure cif is available in the expected location
          if (data.cifDetails && !data.cif) {
            this.loan.cif = data.cifDetails;
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.error = 'Failed to load loan details';
          this.isLoading = false;
        }
      });
    } else {
      this.error = 'Loan ID not found';
      this.isLoading = false;
    }
  }

  getStatusText(status: number): string {
    const statusMap: { [key: number]: string } = {
      0: 'Pending',
      1: 'Approved',
      2: 'Rejected',
      3: 'Active',
      4: 'Completed',
      5: 'Defaulted'
    };
    return statusMap[status] || 'Unknown';
  }

  getCollateralStatusText(status: number): string {
    const statusMap: { [key: number]: string } = {
      0: 'Pending',
      1: 'Verified',
      2: 'Rejected',
      3: 'Expired'
    };
    return statusMap[status] || 'Unknown';
  }

  downloadReport(format: string): void {
    if (!this.loan?.id) return;
    
    const download$ = format === 'pdf' 
      ? this.loanService.downloadLoanPdfReport(this.loan.id)
      : this.loanService.downloadLoanExcelReport(this.loan.id);
  
    download$.subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `loan_detail_${this.loan.id}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (err) => {
        console.error('Error downloading report:', err);
        this.error = 'Failed to download report';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/loan/list']);
  }
}
