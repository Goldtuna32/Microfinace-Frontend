import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionService } from '../../services/transaction.service';
import { AlertService } from 'src/app/alertservice/alert.service';
import { UserService } from 'src/app/demo/users/services/user.service';
import { Router } from '@angular/router';
import { CurrentAccountService } from 'src/app/demo/current-account/services/current-account.service';

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
  userService = inject(UserService); 
  currentAccounts = signal<any[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  branchId: number | null = null; // Add branchId property
  backendError: string | null = null;
  showSuccessAlert: boolean = false;

  constructor(private fb: FormBuilder, private alertService: AlertService, private router: Router, private accountService: CurrentAccountService) {}

  ngOnInit(): void {
    this.initForm();
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
        this.fetchCurrentAccountsByBranch();
      },
      error: (error) => {
        console.error('Failed to load user branch', error);
        this.fetchCurrentAccountsByBranch(); // Still load CIFs without branch filter
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
    this.branchId = storedBranch ? JSON.parse(storedBranch).id : null;
    this.fetchCurrentAccountsByBranch();
  }

  initForm(): void {
    this.transactionForm = this.fb.group({
      currentAccountId: ['', Validators.required], // Backend expects 'currentAccountId'
      amount: ['', [Validators.required, Validators.min(0.01)]],
      transactionType: ['DEBIT', Validators.required], // Backend expects 'transactionType'
      transactionDescription: ['', Validators.required] // Backend expects 'transactionDescription'
    });
  }

  fetchCurrentAccountsByBranch(branchId?: number): void {
    this.loading.set(true);
    this.error.set(null);
  
    this.accountService.getAllCurrentAccountByBranch(branchId).subscribe({
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
          this.alertService.showSuccess('Transaction created successfully!');
          this.transactionForm.reset({ type: 'debit' });
        },
        error: (err) => {
          this.alertService.showError('Transaction failed.'+ err);
        }
      });
  
      this.loading.set(false);
    }
  }
  
  
}
