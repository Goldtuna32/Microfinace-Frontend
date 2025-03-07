import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DealerRegistrationService } from '../../services/dealer-registration.service';

@Component({
  selector: 'app-dealer-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './dealer-registration.component.html',
  styleUrls: ['./dealer-registration.component.scss']
})
export class DealerRegistrationComponent implements OnInit {
  dealerForm: FormGroup;
  regions: string[] = [];
  districts: string[] = [];
  townships: string[] = [];
  locationData: any = {};
  currentAccounts: any[] = [];
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dealerService: DealerRegistrationService
  ) {
    this.dealerForm = this.fb.group({
      companyName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
      status: ['1'],
      currentAccountId: ['', Validators.required],
      address: this.fb.group({
        street: ['', Validators.required],
        region: ['', Validators.required],
        district: ['', Validators.required],
        township: ['', Validators.required]
      })
    });
  }
  ngOnInit(): void {
    // Load JSON file
    this.http.get<any>('assets/myanmar-townships.json').subscribe(data => {
      this.locationData = data;
      this.regions = Object.keys(data);
      console.log('Regions loaded:', this.regions); // Debug: Check regions
    });

    // Load current accounts
    this.loadCurrentAccounts();
  }

  loadCurrentAccounts() {
    this.dealerService.getCurrentAccounts().subscribe((accounts) => {
      this.currentAccounts = accounts;
      console.log('Current Accounts loaded:', this.currentAccounts); // Debug: Check accounts
    });
  }

  onRegionChange() {
    const selectedRegion = this.dealerForm.get('address.region')?.value;
    this.districts = selectedRegion ? Object.keys(this.locationData[selectedRegion]) : [];
    this.townships = []; // Reset townships
    this.dealerForm.get('address')?.patchValue({ district: '', township: '' });
    console.log('Selected Region:', selectedRegion); // Debug: Check selected region
    console.log('Districts:', this.districts); // Debug: Check districts
  }

  onDistrictChange() {
    const selectedRegion = this.dealerForm.get('address.region')?.value;
    const selectedDistrict = this.dealerForm.get('address.district')?.value;
    this.townships = selectedRegion && selectedDistrict ? this.locationData[selectedRegion][selectedDistrict] : [];
    this.dealerForm.get('address.township')?.setValue('');
    console.log('Selected District:', selectedDistrict); // Debug: Check selected district
    console.log('Townships:', this.townships); // Debug: Check townships
  }

  isFormFullyFilled(): boolean {
    return this.dealerForm.valid && Object.values(this.dealerForm.value).every(value => {
      if (typeof value === 'object') {
        return value && Object.values(value).every(subValue => subValue !== '' && subValue !== null);
      }
      return value !== '' && value !== null;
    });
  }
  onSubmit() {
    if (this.dealerForm.valid) {
      const formData = {
        companyName: this.dealerForm.value.companyName,
        phoneNumber: this.dealerForm.value.phoneNumber,
        status: parseInt(this.dealerForm.value.status),
        currentAccountId: parseInt(this.dealerForm.value.currentAccountId),
        address: {
          street: this.dealerForm.get('address.street')?.value,
          region: this.dealerForm.get('address.region')?.value,
          district: this.dealerForm.get('address.district')?.value,
          township: this.dealerForm.get('address.township')?.value
        }
      };

      console.log('Submitting Data:', formData);
      this.dealerService.createDealer(formData).subscribe({
        next: (response) => {
          console.log('Dealer Registered:', response);
          alert('Dealer Registered Successfully');
          this.dealerForm.reset();
        },
        error: (error) => {
          console.error('Error Registering Dealer:', error);
          const errorMessage = error.error?.message || 'Failed to register dealer';
          alert(errorMessage);
        }
      });
    }
  }
}