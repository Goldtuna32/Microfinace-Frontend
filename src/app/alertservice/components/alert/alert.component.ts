// src/app/components/alert/alert.component.ts
import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { AlertService } from '../../alert.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  imports: [CommonModule],
  template: `
    <!-- Success Alert -->
    <div *ngIf="showSuccessAlert" @slideInOut class="alert alert-success alert-dismissible fade show fixed top-[70px] right-4 z-[9999] d-flex align-items-center p-3" style="width: 300px; max-width: 90vw; border: 2px solid red;">
      <svg class="bi flex-shrink-0 me-2" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
      </svg>
      <div>{{ successMessage }}</div>
      <button type="button" class="btn-close ms-auto" (click)="dismissSuccessAlert()" aria-label="Close"></button>
    </div>

    <!-- Error Alert -->
    <div *ngIf="showErrorAlert" @slideInOut class="alert alert-danger alert-dismissible fade show fixed top-[120px] right-4 z-[9999] d-flex align-items-center p-3" style="width: 300px; max-width: 90vw; border: 2px solid red;">
      <svg class="bi flex-shrink-0 me-2" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
      </svg>
      <div><strong>Error!</strong> {{ errorMessage }}</div>
      <button type="button" class="btn-close ms-auto" (click)="dismissErrorAlert()" aria-label="Close"></button>
    </div>
  `,
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-in', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ],
  styles: [
    `
      .alert {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 9999;
      }
      .bi {
        vertical-align: middle;
      }
    `
  ]
})
export class AlertComponent implements OnInit {
  showSuccessAlert: boolean = false;
  showErrorAlert: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    console.log('AlertComponent initialized, window height:', window.innerHeight);
    console.log('Window width:', window.innerWidth);
    console.log('Document height:', document.documentElement.scrollHeight);
    this.alertService.successAlert$.subscribe((message) => {
      console.log('Received success alert:', message);
      this.successMessage = message;
      this.showSuccessAlert = true;
      setTimeout(() => {
        const alertElement = document.querySelector('.alert');
        console.log('Success alert position:', alertElement?.getBoundingClientRect());
        console.log('Parent element position:', alertElement?.parentElement?.getBoundingClientRect());
      }, 100);
      setTimeout(() => {
        this.showSuccessAlert = false;
      }, 5000);
    });

    this.alertService.errorAlert$.subscribe((message) => {
      console.log('Received error alert:', message);
      this.errorMessage = message;
      this.showErrorAlert = true;
      setTimeout(() => {
        const alertElement = document.querySelector('.alert');
        console.log('Error alert position:', alertElement?.getBoundingClientRect());
        console.log('Parent element position:', alertElement?.parentElement?.getBoundingClientRect());
      }, 100);
      setTimeout(() => {
        this.showErrorAlert = false;
      }, 5000);
    });
  }

  dismissSuccessAlert() {
    this.showSuccessAlert = false;
  }

  dismissErrorAlert() {
    this.showErrorAlert = false;
  }
}