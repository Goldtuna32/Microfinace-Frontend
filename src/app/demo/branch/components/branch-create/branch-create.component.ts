import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
 import { HttpClient } from '@angular/common/http';
import { BranchService } from '../../services/branch.service';

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

  constructor(private fb: FormBuilder, private http: HttpClient, private branchService: BranchService) {}

  ngOnInit(): void {
    this.branchForm = this.fb.group({
      region: ['', Validators.required,],
      district: ['', Validators.required],
      township: ['', Validators.required],
      branchName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      status: ['', Validators.required],
      street: ['', Validators.required],
    });

    // ✅ Load JSON file
    this.http.get<any>('assets/myanmar-townships.json').subscribe(data => {
      this.locationData = data;
      this.regions = Object.keys(data); 
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
          email: this.branchForm.value.email,
          status: this.branchForm.value.status
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
          alert("Branch Created Successfully");
          this.branchForm.reset();
        },
        error: error => {
          console.error("Error Creating Branch:", error);
          alert("Failed to create branch");
        }
      });
    }
  }
  
}