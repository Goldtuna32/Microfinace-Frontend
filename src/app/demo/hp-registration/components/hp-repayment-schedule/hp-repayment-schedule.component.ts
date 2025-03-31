import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HpRegistrationService } from '../../services/hp-registration.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { HpScheduleDTO } from '../../models/hp-schedule.dto';

@Component({
  selector: 'app-hp-repayment-schedule',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hp-repayment-schedule.component.html',
  styleUrls: ['./hp-repayment-schedule.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('stagger', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class HpRepaymentScheduleComponent implements OnInit {
  hpRegistrationId!: number;
  schedules: HpScheduleDTO[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hpScheduleService: HpRegistrationService
  ) {}

  ngOnInit(): void {
    this.hpRegistrationId = +this.route.snapshot.paramMap.get('id')!;
    this.loadSchedule();
  }

  loadSchedule() {
    this.loading = true;
    this.error = null;
    this.hpScheduleService.getSchedules(this.hpRegistrationId).subscribe({
      next: (data) => {
        this.schedules = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load repayment schedule';
        this.loading = false;
      }
    });
  }

  getTotal(property: keyof HpScheduleDTO): number {
    return this.schedules.reduce((sum, item) => sum + (Number(item[property]) || 0), 0);
  }

  goBack() {
    this.router.navigate(['/hp-registration/list']);
  }

  printSchedule() {
    window.print();
  }
}