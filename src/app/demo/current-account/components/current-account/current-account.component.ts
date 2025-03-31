import { Component, Inject } from '@angular/core';
import { CurrentAccountService } from '../../services/current-account.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-current-account',
  imports: [ ReactiveFormsModule, CommonModule],
  templateUrl: './current-account.component.html',
  styleUrl: './current-account.component.scss',
  standalone: true
})
export class CurrentAccountComponent {
  accountForm: FormGroup;
  isEditMode = false;
  showBalanceWarning = false;

  constructor(
    private fb: FormBuilder,
    private accountService: CurrentAccountService,
    public dialogRef: MatDialogRef<CurrentAccountComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = !!data.id;

    this.accountForm = this.fb.group({
      id: [data.id || null],
      cifId: [{ value: data.cifId, disabled: true }, Validators.required],
      accountNumber: [data.accountNumber || ''],
      balance: [data.balance || 0, [Validators.required, Validators.min(0)]],
      maximumBalance: [data.maximumBalance || 0, [Validators.required, Validators.min(0)]],
      minimumBalance: [data.minimumBalance || 0, [Validators.required, Validators.min(0)]],
      status: [data.status || 1]
    });

    // Watch for changes to validate balance against minimum balance
    this.accountForm.get('balance')?.valueChanges.subscribe(val => {
      const minBalance = this.accountForm.get('minimumBalance')?.value;
      this.showBalanceWarning = val < minBalance;
    });

    this.accountForm.get('minimumBalance')?.valueChanges.subscribe(val => {
      const balance = this.accountForm.get('balance')?.value;
      this.showBalanceWarning = balance < val;
    });
  }

  saveAccount() {
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return;
    }

    const formData = this.accountForm.getRawValue();
    
    // Reset balance to 0 before saving if it's just for display
    formData.balance = 0;

    if (this.isEditMode) {
      this.accountService.updateCurrentAccount(formData).subscribe({
        next: (response) => {
          this.showSuccessAlert('Account Updated Successfully!');
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.error('Error Updating Account:', error);
          this.showErrorAlert('Failed to update account');
        }
      });
    } else {
      this.accountService.createCurrentAccount(formData).subscribe({
        next: (response) => {
          this.showSuccessAlert('Account Created Successfully!');
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.error('Error Creating Account:', error);
          this.showErrorAlert('Failed to create account');
        }
      });
    }
  }

  private showSuccessAlert(message: string) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-success fixed top-4 right-4 z-50 transition-all duration-500';
    alert.innerHTML = `
      <div class="flex items-center">
        <i class="bi bi-check-circle-fill text-xl mr-2"></i>
        <span>${message}</span>
      </div>
    `;
    document.body.appendChild(alert);
    setTimeout(() => {
      alert.remove();
    }, 3000);
  }

  private showErrorAlert(message: string) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger fixed top-4 right-4 z-50 transition-all duration-500';
    alert.innerHTML = `
      <div class="flex items-center">
        <i class="bi bi-exclamation-triangle-fill text-xl mr-2"></i>
        <span>${message}</span>
      </div>
    `;
    document.body.appendChild(alert);
    setTimeout(() => {
      alert.remove();
    }, 3000);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
