import { Component, Input, OnChanges } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss'],
})
export class TransactionListComponent {
  @Input() accountId!: number;
  transactions: any[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.accountId = Number(this.route.snapshot.paramMap.get('accountId')); // Get Account ID from route
    if (this.accountId) {
      this.loadTransactions();
    }
  }

  loadTransactions() {
    this.transactionService.getTransactionsByAccount(this.accountId).subscribe({
      next: (data) => {
        this.transactions = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching transactions:', error);
        this.errorMessage = 'Failed to load transactions.';
        this.loading = false;
      }
    });
  }
}
