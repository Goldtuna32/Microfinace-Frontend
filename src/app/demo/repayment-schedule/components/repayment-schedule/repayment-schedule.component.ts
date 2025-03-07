import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { RepaymentSchedule } from '../../models/RepaymentSchedule.model';
import { RepaymentScheduleService } from '../../services/repayment-schedule.service';

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
  styleUrl: './repayment-schedule.component.scss'
})
export class RepaymentScheduleComponent implements OnInit {
  loanId: number;
  repaymentSchedule = new MatTableDataSource<RepaymentSchedule>();
  displayedColumns: string[] = [
    'installmentNumber',
    'dueDate',
    'principalAmount',
    'interestAmount',
    'totalPayment',
    'remainingPrincipal'
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
        // Map the data to include installmentNumber if it's not in the DTO
        this.repaymentSchedule.data = schedule.map((item, index) => ({
          ...item,
          installmentNumber: index + 1,
          totalPayment: item.principalAmount + item.interestAmount // Calculate total payment
        }));
      },
      error: (error) => console.error('Failed to load repayment schedule:', error)
    });
  }

  exportReport(format: string): void {
    this.repaymentScheduleService.exportReport(this.loanId, format).subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { 
          type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const fileName = `repayment_schedule.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      },
      error: (error) => console.error(`Failed to export ${format}:`, error)
    });
  }

  goBack(): void {
    this.router.navigate(['/loan/list']); // Updated to match your original routing
  }
}