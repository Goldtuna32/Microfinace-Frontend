import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanService } from '../../services/loan.service';

@Component({
  selector: 'app-loan-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './loan-create.component.html',
  styleUrls: ['./loan-create.component.scss']
})
export class LoanCreateComponent {
  loanForm: FormGroup;

  constructor(private fb: FormBuilder, private loanService: LoanService) {
    this.loanForm = this.fb.group({
      loanAmount: ['', [Validators.required, Validators.min(1000)]],
      loanTerm: ['', [Validators.required, Validators.min(6)]], // Min 6 months
      interestRate: ['', [Validators.required, Validators.min(0)]],
      borrowerName: ['', Validators.required],
      borrowerEmail: ['', [Validators.required, Validators.email]],
      status: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loanForm.valid) {
      this.loanService.createLoan(this.loanForm.value).subscribe({
        next: (response) => console.log('Loan created:', response),
        error: (error) => console.error('Error creating loan:', error)
      });
    } else {
      console.log('Form is invalid');
    }
  }
}