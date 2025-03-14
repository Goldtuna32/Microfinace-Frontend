// src/app/services/alert.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private successAlertSource = new Subject<string>();
  private errorAlertSource = new Subject<string>();

  successAlert$ = this.successAlertSource.asObservable();
  errorAlert$ = this.errorAlertSource.asObservable();

  showSuccess(message: string) {
    console.log('Triggering success alert:', message);
    this.successAlertSource.next(message);
  }

  showError(message: string) {
    console.log('Triggering error alert:', message);
    this.errorAlertSource.next(message);
  }
}