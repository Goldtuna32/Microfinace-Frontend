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

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.fetchCurrentAccounts();
  }

  initForm(): void {
    this.transactionForm = this.fb.group({
      account: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      type: ['debit', Validators.required],
      description: ['', Validators.required]
    });
  }

  fetchCurrentAccounts() {
    this.loading.set(true);
    this.error.set(null);
    
    this.transactionService.getCurrentAccounts().subscribe({
      next: (data) => {
        console.log('Fetched accounts:', data);
        this.currentAccounts.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching accounts:', err);
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
          console.log('Transaction created successfully:', response);
          this.successMessage.set('Transaction created successfully!');
          this.transactionForm.reset({
            type: 'debit'
          });
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error creating transaction:', err);
          this.error.set('Failed to create transaction. Please try again.');
          this.loading.set(false);
        }
      });
    }
  }
  onSubmit() {
    if (this.transactionForm.valid) {
      console.log('🟢 Form Data:', this.transactionForm.value);
      this.transactionService.createTransaction(this.transactionForm.value).subscribe(
        response => console.log('✅ Success:', response),
        error => console.error('❌ Error:', error)
      );
    } else {
      console.warn('⚠️ Form is invalid!');
    }
  }
  

}
