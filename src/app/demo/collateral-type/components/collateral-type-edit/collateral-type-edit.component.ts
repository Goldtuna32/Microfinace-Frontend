import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CollateralType } from '../../models/collateralType.model';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-collateral-type-edit',
  imports: [  ReactiveFormsModule, CommonModule],
  templateUrl: './collateral-type-edit.component.html',
  styleUrl: './collateral-type-edit.component.scss'
})
export class CollateralTypeEditComponent {
  collateralTypeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CollateralTypeEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CollateralType
  ) {
    this.collateralTypeForm = this.fb.group({
      id: [data.id],
      name: [data.name, Validators.required],
      status: [data.status]
    });
  }

  onSubmit() {
    if (this.collateralTypeForm.valid) {
      this.dialogRef.close(this.collateralTypeForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
