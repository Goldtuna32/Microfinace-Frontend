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
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ChartDB } from 'src/app/fack-db/chartData';

// third party import
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    SharedModule, NgApexchartsModule
  ],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements AfterViewInit {
  accountId!: number;
  dataSource = new MatTableDataSource<AccountTransaction>([]);
  displayedColumns: string[] = ['id', 'transactionDate', 'amount', 'status'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Define the correct types for ApexChart options
area1CAC: ApexOptions = {
  chart: { height: 300, type: 'area' },
  stroke: { curve: 'smooth' },
  colors: ['#1f77b4', '#ff7f0e'],
  series: [
    { name: 'Credit', data: [] as number[] }, // Explicitly set type as number[]
    { name: 'Debit', data: [] as number[] }
  ],
  xaxis: { categories: [] as string[] }, // Explicitly set type as string[]
  tooltip: { shared: true, intersect: false },
  dataLabels: { enabled: false }
};


  constructor(
    private route: ActivatedRoute,
    private transactionService: TransactionService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('accountId');
      if (id) {
        this.accountId = +id;
        this.loadTransactions();
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
        this.dataSource.data = response.content || response;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.updateChartData(response);
      },
      error: (error) => console.error('❌ Error loading transactions:', error),
    });
  }

  updateChartData(transactions: AccountTransaction[]) {
    const creditData: number[] = [];
    const debitData: number[] = [];
    const dates: string[] = [];
  
    transactions.forEach(transaction => {
      const date = transaction.transactionDate ? new Date(transaction.transactionDate) : null;
      dates.push(date ? date.toLocaleDateString() : 'Unknown');
  
      if (transaction.amount > 0) {
        creditData.push(transaction.amount);
        debitData.push(0);
      } else {
        creditData.push(0);
        debitData.push(Math.abs(transaction.amount));
      }
    });
  
    this.area1CAC.series = [
      { name: 'Credit', data: creditData },
      { name: 'Debit', data: debitData }
    ];
if (this.area1CAC.xaxis) {
    this.area1CAC.xaxis.categories = dates;
}
  }
  
  
}  