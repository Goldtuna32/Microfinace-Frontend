import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  transactionForm!: FormGroup;
  transactionService = inject(TransactionService);
  currentAccounts = signal<any[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  backendError: string | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.fetchCurrentAccounts();
  }

  initForm(): void {
    this.transactionForm = this.fb.group({
      currentAccountId: ['', Validators.required], // Backend expects 'currentAccountId'
      amount: ['', [Validators.required, Validators.min(0.01)]],
      transactionType: ['DEBIT', Validators.required], // Backend expects 'transactionType'
      transactionDescription: ['', Validators.required] // Backend expects 'transactionDescription'
    });
  }

  fetchCurrentAccounts() {
    this.loading.set(true);
    this.error.set(null);
  
    this.transactionService.getCurrentAccounts().subscribe({
      next: (data) => {
        console.log('✅ Received accounts:', data); // Debugging
        this.currentAccounts.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('❌ Error fetching accounts:', err);
        this.error.set('Failed to load accounts. Please try again.');
        this.loading.set(false);
      }
    });
  }

  submitTransaction() {
    if (this.transactionForm.valid) {
      this.loading.set(true);
      this.error.set(null);
      this.successMessage.set(null);
  
      const transactionData = this.transactionForm.value;
  
      this.transactionService.createTransaction(transactionData).subscribe({
        next: (response) => {
          console.log('✅ Transaction created successfully:', response);
          this.successMessage.set('Transaction created successfully!');
          this.transactionForm.reset({ type: 'debit' });
        },
        error: (err) => {
          console.error('❌ Error creating transaction:', err);
          this.error.set(err.message || 'Transaction failed.');
        }
      });
  
      this.loading.set(false);
    }
  }
  
  
}
