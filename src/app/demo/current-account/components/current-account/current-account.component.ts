import { Component, Inject } from '@angular/core';
import { CurrentAccountService } from '../../services/current-account.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-current-account',
  imports: [ ReactiveFormsModule],
  templateUrl: './current-account.component.html',
  styleUrl: './current-account.component.scss'
})
export class CurrentAccountComponent {
  accountForm: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private accountService: CurrentAccountService,
    public dialogRef: MatDialogRef<CurrentAccountComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = !!data.id; // If there's an ID, we're editing

    this.accountForm = this.fb.group({
      id: [data.id || null],
      cifId: [{ value: data.cifId, disabled: true }, Validators.required], // CIF ID is readonly
      accountNumber: [data.accountNumber || ''], 
      balance: [data.balance || 0, [Validators.required, Validators.min(0)]], // ✅ Ensure it's a number
      maximumBalance: [data.maximumBalance || 0, [Validators.required, Validators.min(0)]], 
      minimumBalance: [data.minimumBalance || 0, [Validators.required, Validators.min(0)]], 
      status: [data.status || 1] 
    });
  }

  ngOnInit(): void {}

  saveAccount() {
    if (this.accountForm.invalid) {
      alert('Please fill in all required fields!');
      return;
    }
  
    const formData = this.accountForm.getRawValue(); // Get disabled values too!
    console.log('Form Data:', formData); // Debugging: Check CIF ID before sending
  
    if (this.isEditMode) {
      this.accountService.updateCurrentAccount(formData).subscribe({
        next: (response) => {
          alert('Current Account Updated Successfully!');
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.error('Error Updating Account:', error);
          alert('Failed to update Current Account');
        }
      });
    } else {
      this.accountService.createCurrentAccount(formData).subscribe({
        next: (response) => {
          alert('Current Account Created Successfully!');
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.error('Error Creating Account:', error);
          alert('Failed to create Current Account');
        }
      });
    }
  }  

  closeDialog() {
    this.dialogRef.close();
  }
}
