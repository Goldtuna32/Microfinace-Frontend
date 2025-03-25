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
  loan: SmeLoanRegistration | null = null;
  cif: CIF | null = null;
  collaterals: Collateral[] = []; // To store detailed collateral data
  errorMessage: string | null = null;
  selectedCollateralPhoto: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loanService: LoanService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadLoanDetails(id);
      this.loadCollaterals(id); // Fetch detailed collaterals
    } else {
      this.errorMessage = 'Invalid loan ID';
    }
  }

  showCollateralPhoto(photoUrl: string): void {
    this.selectedCollateralPhoto = photoUrl;
  }

  closeModal(): void {
    this.selectedCollateralPhoto = null;
  }

  loadCifDetails(currentAccountId: number): void {
    this.loanService.getCifByCurrentAccountId(currentAccountId).subscribe({
      next: (cif) => {
        this.cif = cif;
        console.log('CIF Data:', cif);  
      },
      error: (error) => this.errorMessage = 'Failed to load CIF details: ' + error.message
    });
  }

  loadLoanDetails(id: number): void {
    this.loanService.getLoanById(id).subscribe({
      next: (loan) => {
        this.loan = loan;
        console.log('Loan Data:', loan);
        // After loan is loaded, fetch CIF using currentAccountId
        if (loan.currentAccountId) {
          this.loadCifDetails(loan.currentAccountId);
        } else {
          this.errorMessage = 'No currentAccountId found for this loan';
        }
      },
      error: (error) => this.errorMessage = 'Failed to load loan details: ' + error.message
    });
  }

  loadCollaterals(loanId: number): void {
    this.loanService.getCollateralsByLoanId(loanId).subscribe({
      next: (collaterals) => {
        this.collaterals = collaterals;
      },
      error: (error) => this.errorMessage = 'Failed to load collaterals: ' + error.message
    });
  }

  goBack(): void {
    this.router.navigate(['/loan/list']);
  }

  viewCollateralDetail(collateralId: number | undefined): void {
    if (collateralId) {
      this.router.navigate(['/collateral', collateralId]); // Assuming a route for collateral details
    }
  }
}
