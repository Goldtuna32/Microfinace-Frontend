import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Branch } from '../../models/branch.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AlertService } from 'src/app/alertservice/alert.service';


@Component({
  selector: 'app-branch-edit',
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './branch-edit.component.html',
  styleUrl: './branch-edit.component.scss'
})
export class BranchEditComponent implements OnInit {
  editForm: FormGroup;
  originalBranch: Branch;
  locationData: any = {};
  regions: string[] = [];
  districts: string[] = [];
  townships: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<BranchEditComponent>,
    private fb: FormBuilder,
    private http: HttpClient,
    private alertService: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: Branch
  ) {
    this.originalBranch = data;

    this.editForm = this.fb.group({
      id: [data.id, Validators.required],
      branchCode: [{ value: data.branchCode, disabled: true }, Validators.required],
      branchName: [data.branchName, Validators.required],
      phoneNumber: [data.phoneNumber, [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
      email: [data.email, [Validators.required, Validators.email]],
      region: [data.address?.region || '', Validators.required],
      district: [data.address?.district || '', Validators.required],
      township: [data.address?.township || '', Validators.required],
      street: [data.address?.street || '', Validators.required],
      status: [data.status, Validators.required],
      addressId: [data.address?.id || 0]
    });
  }

  ngOnInit(): void {
    this.http.get<any>('assets/myanmar-townships.json').subscribe({
      next: (data) => {
        console.log('Loaded myanmar-townships.json:', data);
        this.locationData = data;
        this.regions = Object.keys(data).sort();
        console.log('Regions:', this.regions);

        // Initialize dropdowns based on original branch data
        this.initializeAddressDropdowns();
      },
      error: (error) => {
        console.error('Error loading myanmar-townships.json:', error);
        this.regions = []; // Ensure regions is empty on error
      }
    });
  }

  initializeAddressDropdowns(): void {
    const region = this.editForm.get('region')?.value;
    if (region && this.locationData[region]) {
      this.districts = Object.keys(this.locationData[region]).sort();
      console.log('Initial Districts for', region, ':', this.districts);

      const district = this.editForm.get('district')?.value;
      if (district && this.locationData[region][district]) {
        this.townships = this.locationData[region][district].sort();
        console.log('Initial Townships for', district, ':', this.townships);

        // Ensure township is valid; reset if not in list
        const township = this.editForm.get('township')?.value;
        if (township && !this.townships.includes(township)) {
          console.warn('Township', township, 'not found in', this.townships, 'Resetting township.');
          this.editForm.get('township')?.setValue('');
        }
      } else {
        console.log('District', district, 'not found in region', region);
        this.editForm.get('district')?.setValue('');
        this.editForm.get('township')?.setValue('');
        this.townships = [];
      }
    } else {
      console.log('Region', region, 'not found in JSON');
      this.editForm.get('region')?.setValue('');
      this.editForm.get('district')?.setValue('');
      this.editForm.get('township')?.setValue('');
      this.districts = [];
      this.townships = [];
    }
  }

  onRegionChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const region = target.value;
    this.districts = region && this.locationData[region] ? Object.keys(this.locationData[region]).sort() : [];
    this.townships = [];
    this.editForm.get('district')?.setValue('');
    this.editForm.get('township')?.setValue('');
    console.log('Region changed to', region, 'Districts:', this.districts);
  }

  onDistrictChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const district = target.value;
    const region = this.editForm.get('region')?.value;
    this.townships = region && district && this.locationData[region]?.[district] ? this.locationData[region][district].sort() : [];
    this.editForm.get('township')?.setValue('');
    console.log('District changed to', district, 'Townships:', this.townships);
  }

  save() {
    if (this.editForm.valid) {
      const formValue = this.editForm.getRawValue();

      const id = formValue.id ? Number(formValue.id) : null;
      if (!id || isNaN(id) || id <= 0) {
        console.error('Invalid Branch ID for editing:', formValue.id || 'undefined');
        return;
      }

      const updatedBranch: Branch = {
        id: id,
        branchCode: formValue.branchCode,
        branchName: formValue.branchName,
        phoneNumber: formValue.phoneNumber,
        email: formValue.email,
        address: {
          id: formValue.addressId || 0,
          region: formValue.region,
          district: formValue.district,
          township: formValue.township,
          street: formValue.street
        },
        createdDate: this.originalBranch.createdDate,
        updatedDate: new Date().toISOString(),
        status: formValue.status
      };

      console.log('Updated Branch data:', updatedBranch);
      this.alertService.showSuccess('Branch updated successfully');
      this.dialogRef.close(updatedBranch);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
