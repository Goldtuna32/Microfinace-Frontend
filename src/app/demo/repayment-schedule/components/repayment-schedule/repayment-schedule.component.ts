import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { RepaymentSchedule } from '../../models/RepaymentSchedule.model';
import { RepaymentScheduleService } from '../../services/repayment-schedule.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-repayment-schedule',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule
  ],
  templateUrl: './repayment-schedule.component.html',
  styleUrl: './repayment-schedule.component.scss',
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [
        animate('500ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('rowHover', [
      state('hover', style({
        transform: 'translateY(-3px)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      })),
      transition('* => hover', animate('200ms ease-in')),
      transition('hover => *', animate('200ms ease-out'))
    ])
  ]
})
export class RepaymentScheduleComponent implements OnInit {
  loanId: number;
  repaymentSchedule = new MatTableDataSource<RepaymentSchedule & { state?: string }>();
  displayedColumns: string[] = [
    'status',
    'installmentNumber',
    'dueDate',
    'paymentDetails',
    'balance',
    'actions'
  ];

  // Summary calculations
  totalLoanAmount = 0;
  totalPrincipal = 0;
  totalInterest = 0;
  totalPaidAmount = 0;
  totalPaidPrincipal = 0;
  totalPaidInterest = 0;
  totalRemainingAmount = 0;
  totalRemainingPrincipal = 0;
  totalRemainingInterest = 0;

  constructor(
    private route: ActivatedRoute,
    private repaymentScheduleService: RepaymentScheduleService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.loanId = +this.route.snapshot.paramMap.get('loanId')!;
  }

  ngOnInit(): void {
    this.loadRepaymentSchedule();
  }

  loadRepaymentSchedule(): void {
    this.repaymentScheduleService.getRepaymentSchedule(this.loanId).subscribe({
      next: (schedule) => {
        const processedSchedule = schedule.map((item, index) => ({
          ...item,
          installmentNumber: index + 1,
          totalPayment: item.principalAmount + item.interestAmount + (item.interestOverDue || 0),
          dueDate: new Date(item.dueDate),
          state: 'default'
        }));
        
        this.repaymentSchedule.data = processedSchedule;
        this.calculateSummaryTotals(processedSchedule);
      },
      error: (error) => console.error('Failed to load repayment schedule:', error)
    });
  }

  calculateSummaryTotals(schedule: any[]): void {
    this.totalLoanAmount = schedule.reduce((sum, item) => sum + item.principalAmount + item.interestAmount, 0);
    this.totalPrincipal = schedule.reduce((sum, item) => sum + item.principalAmount, 0);
    this.totalInterest = schedule.reduce((sum, item) => sum + item.interestAmount, 0);
    
    const paidItems = schedule.filter(item => item.status === 2);
    this.totalPaidAmount = paidItems.reduce((sum, item) => sum + item.totalPayment, 0);
    this.totalPaidPrincipal = paidItems.reduce((sum, item) => sum + item.principalAmount, 0);
    this.totalPaidInterest = paidItems.reduce((sum, item) => sum + item.interestAmount + (item.interestOverDue || 0), 0);
    
    this.totalRemainingAmount = this.totalLoanAmount - this.totalPaidAmount;
    this.totalRemainingPrincipal = this.totalPrincipal - this.totalPaidPrincipal;
    this.totalRemainingInterest = this.totalInterest - (this.totalPaidInterest - paidItems.reduce((sum, item) => sum + (item.interestOverDue || 0), 0));
  }

  daysOverdue(dueDate: Date | string): number {
    const today = new Date();
    const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
    const diffTime = Math.abs(today.getTime() - due.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isOverdue(item: any): boolean {
    if (item.status === 6) return false; // Completed payments are never overdue
    
    // Check if there's overdue interest or if payment is late
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const due = typeof item.dueDate === 'string' ? new Date(item.dueDate) : item.dueDate;
    due.setHours(0, 0, 0, 0);
    
    return (item.interestOverDue > 0) || (due < today && item.status !== 6);
  }

  getStatusClass(item: any): string {
    if (item.status === 6) return 'text-success fw-bold'; // Completed
    
    // Check if it's overdue
    if (this.isOverdue(item)) {
      return 'text-danger fw-bold'; // Overdue
    }
    
    return 'text-secondary'; // Pending (status = 1)
  }

  getStatusText(item: any): string {
    if (item.status === 6) return 'Completed';
    
    // Check if it's overdue
    if (this.isOverdue(item)) {
      return 'Overdue';
    }
    
    return 'Pending';
  }
  

  
getStatusIcon(item: any): string {
  if (item.status === 6) return 'bi-check-circle-fill';
  
  // Check if it's overdue
  if (this.isOverdue(item)) {
    return 'bi-exclamation-triangle-fill';
  }
  
  return 'bi-clock-history';
}

  openPaymentDialog(item: any): void {
    // const dialogRef = this.dialog.open(PaymentDialogComponent, {
    //   width: '500px',
    //   data: {
    //     loanId: this.loanId,
    //     installment: item
    //   }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result === 'success') {
    //     this.loadRepaymentSchedule();
    //   }
    // });
  }

  viewPaymentHistory(item: any): void {
    // this.dialog.open(PaymentHistoryComponent, {
    //   width: '700px',
    //   data: {
    //     loanId: this.loanId,
    //     installmentNumber: item.installmentNumber
    //   }
    // });
  }

  generateSchedule(): void {
    // this.repaymentScheduleService.generateSchedule(this.loanId).subscribe({
    //   next: () => {
    //     this.loadRepaymentSchedule();
    //   },
    //   error: (error) => console.error('Failed to generate schedule:', error)
    // });
  }

  exportReport(format: string): void {
    this.repaymentScheduleService.exportReport(this.loanId, format).subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { 
          type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const fileName = `repayment_schedule_${this.loanId}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      },
      error: (error) => console.error(`Failed to export ${format}:`, error)
    });
  }

  goBack(): void {
    this.router.navigate(['/loan/list']);
  }
}