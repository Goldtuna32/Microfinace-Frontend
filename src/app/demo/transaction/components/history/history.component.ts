import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { TransactionService } from '../../services/transaction.service';
import { AccountTransaction } from '../../models/transaction.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements AfterViewInit {
  accountId!: number; // Use this instead of @Input()
  dataSource = new MatTableDataSource<AccountTransaction>([]);
  displayedColumns: string[] = ['id', 'transactionDate', 'amount', 'status'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private route: ActivatedRoute, // Inject ActivatedRoute
    private transactionService: TransactionService
  ) {}

  ngOnInit() {
    // Fetch accountId from route params
    this.route.paramMap.subscribe(params => {
      const id = params.get('accountId');
      if (id) {
        this.accountId = +id; // Convert to number
        console.log("✅ Account ID from route:", this.accountId);
        this.loadTransactions(); // Load transactions after setting accountId
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadTransactions() {
    if (!this.accountId) return;

    this.transactionService.getTransactionsByAccount(this.accountId).subscribe({
      next: (response) => {
        console.log("✅ Transactions fetched for Account:", this.accountId, response);
        this.dataSource.data = response.content || response; // Adjust based on API response
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => console.error('❌ Error loading transactions:', error),
    });
  }
}  