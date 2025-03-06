import { Component, OnInit } from '@angular/core';
import { SmeLoanRegistration } from '../../models/SmeLoanRegistration.model';
import { ActivatedRoute, Router } from '@angular/router';
import { LoanService } from '../../services/loan.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loan-detail',
  imports: [ CommonModule],
  templateUrl: './loan-detail.component.html',
  styleUrl: './loan-detail.component.scss'
})
export class LoanDetailComponent implements OnInit{
  loan: SmeLoanRegistration | null = null;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loanService: LoanService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadLoanDetails(id);
    } else {
      this.errorMessage = 'Invalid loan ID';
    }
  }

  loadLoanDetails(id: number): void {
    this.loanService.getLoanById(id).subscribe({
      next: (loan) => {
        this.loan = loan;
      },
      error: (error) => this.errorMessage = 'Failed to load loan details: ' + error.message
    });
  }

  goBack(): void {
    this.router.navigate(['/loan/list']);
  }
}
