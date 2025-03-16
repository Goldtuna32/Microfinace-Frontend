import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DealerRegistrationService } from '../../services/dealer-registration.service';
import { AlertService } from 'src/app/alertservice/alert.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dealer-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './dealar-edit.component.html',
  styleUrls: ['./dealar-edit.component.scss']
})
export class DealerEditComponent implements OnInit {
  dealerForm: FormGroup;
  dealerId: number;
  errorMessage: string = '';
  successMessage: string = '';
  currentAccounts: any[] = [];
  regions: string[] = [];
  districts: string[] = [];
  townships: string[] = [];
  locationData: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dealerService: DealerRegistrationService,
    private alertService: AlertService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.dealerId = 0;
    this.dealerForm = this.fb.group({
      companyName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      status: [{ value: 1, disabled: true }],
      registrationDate: [{ value: '', disabled: true }],
      currentAccountId: ['', Validators.required],
      address: this.fb.group({
        region: ['', Validators.required],
        district: ['', Validators.required],
        township: ['', Validators.required],
        street: ['', Validators.required]
      })
    });
  }

  ngOnInit(): void {
    this.dealerId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCurrentAccounts();
    this.loadLocationData();
    if (this.dealerId) {
      this.loadDealerData();
    }
  }

  loadLocationData(): void {
    this.http.get<any>('assets/myanmar-townships.json').subscribe({
      next: (data) => {
        this.locationData = data;
        this.regions = Object.keys(data);
      },
      error: (error) => {
        this.alertService.showError('Error loading location data');
        console.error('Error loading location data:', error);
      }
    });
  }

  loadCurrentAccounts(): void {
    this.dealerService.getCurrentAccounts().subscribe({
      next: (accounts) => {
        this.currentAccounts = accounts;
      },
      error: (error) => {
        this.alertService.showError('Error Loading Current Accounts');
        this.errorMessage = 'Error loading current accounts: ' + error.message;
      }
    });
  }

  loadDealerData(): void {
    this.dealerService.getDealerById(this.dealerId).subscribe({
      next: (dealer) => {
        this.dealerForm.patchValue({
          companyName: dealer.companyName,
          phoneNumber: dealer.phoneNumber,
          status: dealer.status,
          registrationDate: dealer.registrationDate,
          currentAccountId: dealer.currentAccountId,
          address: {
            region: dealer.address.region,
            district: dealer.address.district,
            township: dealer.address.township,
            street: dealer.address.street
          }
        });
        // After loading dealer data, update dependent dropdowns
        this.onRegionChange();
        this.onDistrictChange();
      },
      error: (error) => {
        this.errorMessage = 'Error loading dealer data: ' + error.message;
      }
    });
  }

  onRegionChange(): void {
    const selectedRegion = this.addressForm.get('region')?.value;
    this.districts = selectedRegion ? Object.keys(this.locationData[selectedRegion]) : [];
    this.townships = [];
    this.addressForm.patchValue({ district: '', township: '' });
  }

  onDistrictChange(): void {
    const selectedRegion = this.addressForm.get('region')?.value;
    const selectedDistrict = this.addressForm.get('district')?.value;
    this.townships = selectedRegion && selectedDistrict ? this.locationData[selectedRegion][selectedDistrict] : [];
    this.addressForm.get('township')?.setValue('');
  }

  onSubmit(): void {
    if (this.dealerForm.valid) {
      const dealerData = {
        ...this.dealerForm.getRawValue(), // Use getRawValue() to include disabled fields
        id: this.dealerId
      };

      this.dealerService.updateDealer(this.dealerId, dealerData).subscribe({
        next: () => {
          setTimeout(() => {
            this.alertService.showSuccess('Dealer updated successfully');
            this.router.navigate(['/dealer-list']);
          }, 2000);
        },
        error: (error) => {
          this.alertService.showError('Error updating dealer');
          this.errorMessage = 'Error updating dealer: ' + error.message;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/dealer-list']);
  }

  get addressForm(): FormGroup {
    return this.dealerForm.get('address') as FormGroup;
  }
}
