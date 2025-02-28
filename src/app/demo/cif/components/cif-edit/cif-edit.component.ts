import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CifService } from '../../services/cif.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CIF } from '../../models/cif.model';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cif-edit',
  imports: [ReactiveFormsModule, MatFormField, MatLabel, CommonModule],
  templateUrl: './cif-edit.component.html',
  styleUrl: './cif-edit.component.scss'
})
export class CifEditComponent {
  editForm: FormGroup;
  frontNrcFile?: File;
  backNrcFile?: File;
  originalCif: CIF;

  constructor(
    public dialogRef: MatDialogRef<CifEditComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: CIF
) {
  this.originalCif = data;
  console.log('Original CIF data:', this.originalCif); // Debug
  this.editForm = this.fb.group({
    id: [data.id, Validators.required],
    name: [data.name, Validators.required],
    nrcNumber: [data.nrcNumber, Validators.required],
    branchId: [data.branchId, Validators.required],
    dob: [data.dob],
    gender: [data.gender],
    phoneNumber: [data.phoneNumber],
    email: [data.email],
    address: [data.address],
    maritalStatus: [data.maritalStatus],
    occupation: [data.occupation],
    incomeSource: [data.incomeSource],
  });
  }

  handleFileInput(event: any, type: 'frontNrc' | 'backNrc') {
    const file = event.target.files[0];
    if (file) {
      if (type === 'frontNrc') {
        this.frontNrcFile = file;
      } else {
        this.backNrcFile = file;
      }
    }
  }

  save() {
    if (this.editForm.valid) {
      const formData = new FormData();
      const formValue = this.editForm.getRawValue();
  
      const id = formValue.id ? Number(formValue.id) : null;
      if (!id || isNaN(id) || id <= 0) {
        console.error('Invalid CIF ID for editing:', formValue.id || 'undefined');
        return;
      }
  
      formData.append('id', id.toString());
      Object.keys(this.editForm.value).forEach((key) => {
        if (key !== 'id') {
          const value = this.editForm.value[key];
          formData.append(key, value !== null && value !== undefined ? value : '');
        }
      });
  
      // Handle front NRC photo
      if (this.frontNrcFile) {
        formData.append('frontNrc', this.frontNrcFile);
      } else if (this.originalCif.fNrcPhotoUrl && this.originalCif.fNrcPhotoUrl.trim()) {
        formData.append('fNrcPhotoUrl', this.originalCif.fNrcPhotoUrl);
      }
  
      // Handle back NRC photo
      if (this.backNrcFile) {
        formData.append('backNrc', this.backNrcFile);
      } else if (this.originalCif.bNrcPhotoUrl && this.originalCif.bNrcPhotoUrl.trim()) {
        formData.append('bNrcPhotoUrl', this.originalCif.bNrcPhotoUrl);
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

  onFrontNrcFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.frontNrcFile = input.files[0];
    }
  }

  onBackNrcFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.backNrcFile = input.files[0];
    }
  }

  close() {
    this.dialogRef.close();
  }
}
