import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Collateral } from '../../models/collateral.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-collateral-edit',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './collateral-edit.component.html',
  styleUrl: './collateral-edit.component.scss'
})
export class CollateralEditComponent {
  editForm: FormGroup;
  frontPhotoFile?: File;
  backPhotoFile?: File;
  originalCollateral: Collateral;

  constructor(
    public dialogRef: MatDialogRef<CollateralEditComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Collateral
  ) {
    this.originalCollateral = data;
    console.log('Original Collateral data:', this.originalCollateral); // Debug

    this.editForm = this.fb.group({
      id: [data.id, Validators.required],
      value: [data.value, Validators.required],
      description: [data.description, Validators.required],
      status: [data.status, Validators.required],
      date: [data.date],
    });
  }

  handleFileInput(event: any, type: 'frontPhoto' | 'backPhoto'): void {
    const file = event.target.files[0];
    if (file) {
      if (type === 'frontPhoto') {
        this.frontPhotoFile = file;
      } else {
        this.backPhotoFile = file;
      }
    }
  }

  save(): void {
    if (this.editForm.valid) {
      const formData = new FormData();
      const formValue = this.editForm.getRawValue();

      const id = formValue.id ? Number(formValue.id) : null;
      if (!id || isNaN(id) || id <= 0) {
        console.error('Invalid Collateral ID for editing:', formValue.id || 'undefined');
        return;
      }

      formData.append('id', id.toString());
      Object.keys(this.editForm.value).forEach((key) => {
        if (key !== 'id') {
          const value = this.editForm.value[key];
          formData.append(key, value !== null && value !== undefined ? value.toString() : '');
        }
      });

      // Handle front collateral photo
      if (this.frontPhotoFile) {
        formData.append('f_collateral_photo', this.frontPhotoFile);
      } else if (this.originalCollateral.f_collateral_photo && this.originalCollateral.f_collateral_photo.trim()) {
        formData.append('f_collateral_photo', this.originalCollateral.f_collateral_photo);
      }

      // Handle back collateral photo
      if (this.backPhotoFile) {
        formData.append('b_collateral_photo', this.backPhotoFile);
      } else if (this.originalCollateral.b_collateral_photo && this.originalCollateral.b_collateral_photo.trim()) {
        formData.append('b_collateral_photo', this.originalCollateral.b_collateral_photo);
      }

      console.log('Final FormData contents before close:');
      const formDataContents: { [key: string]: any } = {};
      formData.forEach((value, key) => {
        formDataContents[key] = value;
      });
      console.log(formDataContents);

      this.dialogRef.close(formData);
    }
  }

  onFrontPhotoFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.frontPhotoFile = input.files[0];
    }
  }

  onBackPhotoFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.backPhotoFile = input.files[0];
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
