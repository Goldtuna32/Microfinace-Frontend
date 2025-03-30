import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { RepaymentSchedule } from '../../models/RepaymentSchedule.model';
import { RepaymentScheduleService } from '../../services/repayment-schedule.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

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
  repaymentSchedule = new MatTableDataSource<RepaymentSchedule>();
  displayedColumns: string[] = [
    'status',
    'installmentNumber',
    'dueDate',
    'principalAmount',
    'interestAmount',
    'totalPayment',
    'remainingPrincipal',
    'actions'
  ];

  constructor(
    private route: ActivatedRoute,
    private repaymentScheduleService: RepaymentScheduleService,
    private router: Router
  ) {
    this.loanId = +this.route.snapshot.paramMap.get('loanId')!;
  }

  ngOnInit(): void {
    this.loadRepaymentSchedule();
  }

  loadRepaymentSchedule(): void {
    this.repaymentScheduleService.getRepaymentSchedule(this.loanId).subscribe({
      next: (schedule) => {
        this.repaymentSchedule.data = schedule.map((item, index) => ({
          ...item,
          installmentNumber: index + 1,
          totalPayment: item.principalAmount + item.interestAmount,
          dueDate: new Date(item.dueDate) // Ensure dueDate is Date object
        }));
      },
      error: (error) => console.error('Failed to load repayment schedule:', error)
    });
  }

  isPastDue(dueDate: Date | string, status?: number): boolean {
    // If status is completed (6), it's not past due regardless of date
    if (status === 6) return false;
    
    const today = new Date();
    const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
    return due < today && status !== 6;
  }


  getStatusClass(status: number | undefined): string {
    switch(status) {
      case 6: return 'status-completed';
      case 5: return 'status-overdue';
      case 4: return 'status-partial';
      case 3: return 'status-processing';
      case 2: return 'status-upcoming';
      case 1: 
      default: return 'status-pending';
    }
  }

  getStatusText(status: number | undefined): string {
    switch(status) {
      case 6: return 'Completed';
      case 5: return 'Overdue';
      case 4: return 'Partial';
      case 3: return 'Processing';
      case 2: return 'Upcoming';
      case 1: 
      default: return 'Pending';
    }
  }

  getStatusIcon(status: number | undefined): string {
    switch(status) {
      case 6: return 'bi-check-circle-fill';
      case 5: return 'bi-exclamation-triangle-fill';
      case 4: return 'bi-pie-chart-fill';
      case 3: return 'bi-hourglass-split';
      case 2: return 'bi-calendar-event';
      case 1: 
      default: return 'bi-clock-history';
    }
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

  // makePayment(item: RepaymentSchedule): void {
  //   // Implement payment logic here
  //   console.log('Making payment for installment:', item.installmentNumber);
  // }
}