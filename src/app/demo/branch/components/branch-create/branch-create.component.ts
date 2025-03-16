import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
 import { HttpClient } from '@angular/common/http';
import { BranchService } from '../../services/branch.service';
import { AlertService } from 'src/app/alertservice/alert.service';
import { Router } from '@angular/router';
import { Address, Branch } from '../../models/branch.model';

@Component({
  selector: 'app-branch-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './branch-create.component.html',
  styleUrl: './branch-create.component.scss'
})
export class BranchCreateComponent {
  branchForm!: FormGroup;
  regions: string[] = [];
  districts: string[] = [];
  townships: string[] = [];
  locationData: any = {}; // Store the JSON data

  constructor(private fb: FormBuilder, private http: HttpClient, private branchService: BranchService, private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.branchForm = this.fb.group({
      region: ['', Validators.required,],
      district: ['', Validators.required],
      township: ['', Validators.required],
      branchName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      street: ['', Validators.required],
    });

    // ✅ Load JSON file
    this.http.get<any>('assets/myanmar-townships.json').subscribe(data => {
      this.locationData = data;
      this.regions = Object.keys(data); 
    });

    this.branchForm.valueChanges.subscribe(() => {
      this.checkDuplicates();
    });
  }
 
  checkDuplicates(): void {
    const branchData: Partial<Branch> = {
      branchName: this.branchForm.value.branchName,
      phoneNumber: this.branchForm.value.phoneNumber,
      email: this.branchForm.value.email,
      address: {
        region: this.branchForm.value.region,
        district: this.branchForm.value.district,
        township: this.branchForm.value.township,
        street: this.branchForm.value.street
      } as Address
    };

    this.branchService.checkDuplicate(branchData).subscribe({
      next: (isDuplicate) => {
        if (isDuplicate) {
          this.branchForm.get('branchName')?.setErrors({ duplicate: true });
          this.branchForm.get('phoneNumber')?.setErrors({ duplicate: true });
          this.branchForm.get('email')?.setErrors({ duplicate: true });
        } else {
          this.branchForm.get('branchName')?.setErrors(null);
          this.branchForm.get('phoneNumber')?.setErrors(null);
          this.branchForm.get('email')?.setErrors(null);
        }
      },
      error: (err) => {
        console.error('Error checking duplicates:', err);
        this.alertService.showError('Failed to check duplicates. Please try again.');
      }
    });
  }

  onRegionChange() {
    const selectedRegion = this.branchForm.value.region;
    this.districts = selectedRegion ? Object.keys(this.locationData[selectedRegion]) : [];
    this.townships = []; // Reset townships
    this.branchForm.patchValue({ district: '', township: '' }); // Reset selections
  }

  
  onDistrictChange() {
    const selectedRegion = this.branchForm.value.region;
    const selectedDistrict = this.branchForm.value.district;
    this.townships = selectedRegion && selectedDistrict ? this.locationData[selectedRegion][selectedDistrict] : [];
    this.branchForm.patchValue({ township: '' }); // Reset township selection
  }

  isFormFullyFilled(): boolean {
    // Check if every form field has a value
    return this.branchForm.valid && Object.values(this.branchForm.value).every(value => {
      if (typeof value === 'object') {
        return value && Object.values(value).every(subValue => subValue !== '' && subValue !== null);
      }
      return value !== '' && value !== null;
    });
  }

  onSubmit() {
    if (this.branchForm.valid) {
      const formData = {
        branch: {
          branchName: this.branchForm.value.branchName,
          phoneNumber: this.branchForm.value.phoneNumber,
          email: this.branchForm.value.email
        },
        address: {
          region: this.branchForm.value.region.trim(),
          district: this.branchForm.value.district,
          township: this.branchForm.value.township,
          street: this.branchForm.value.street
        }
      };
  
      console.log("Submitting Data:", formData); 
  
      this.branchService.createBranch(formData).subscribe({
        next: response => {
          console.log("Branch Created:", response);
          this.alertService.showSuccess("Branch Created Successfully");
          this.router.navigate(['/branch/list']);
          this.branchForm.reset();
        },
        error: error => {
          this.alertService.showError("Branch Creation Failed "+ error.error.message);
        }
      });
    }
  }
  
}