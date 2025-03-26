import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DealerRegistrationService } from '../../services/dealer-registration.service';

@Component({
  selector: 'app-dealer-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './dealar-edit.component.html',
  styleUrls: ['./dealar-edit.component.scss']
})
export class DealerEditComponent implements OnInit {
  dealerForm!: FormGroup;
  dealerId: number | null = null;
  isEditMode: boolean = false; // 🔹 Track if we're in edit mode
districts: any;
currentAccounts: any;
regions: any;

  constructor(
    private fb: FormBuilder,
    private dealerService: DealerRegistrationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dealerId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.dealerId; // If dealerId exists, it's edit mode
  
    this.dealerForm = this.fb.group({
      companyName: [''],
      phoneNumber: [''],
      status: [''],
      address: this.fb.group({
        street: [''],
        region: [''],
        district: [''],
        township: ['']
      }),
      currentAccountId: [{ value: '', disabled: this.isEditMode }] // 🔹 Disable in edit mode
    });

    
    console.log('Dealer Form Initialized:', this.dealerForm.value);
    console.log('Current Account ID Control:', this.dealerForm.get('currentAccountId'));
    
    if (this.isEditMode) {
      this.loadDealerData();
    }
  }
  
  loadDealerData() {
    if (!this.dealerId) return;
  
    this.dealerService.getDealerById(this.dealerId).subscribe(dealer => {
      if (dealer) {
        console.log('Raw Dealer Data:', dealer); // Debugging output
  
        this.dealerForm.patchValue({
          companyName: dealer.companyName,
          phoneNumber: dealer.phoneNumber,
          status: dealer.status,
          address: {
            street: dealer.address?.street || '',
            region: dealer.address?.region || '',
            district: dealer.address?.district || '', // Ensure 'district' matches API response
            township: dealer.address?.township || '',
          },
          currentAccountId: dealer.currentAccountId || ''
        });
  
        console.log('Dealer Form After Patch:', this.dealerForm.value);
      }
    });
  }
  
  
  
  onSubmit() {
    if (this.dealerForm.valid) {
      if (this.isEditMode) {
        // 🔹 Update dealer
        this.dealerService.updateDealer(this.dealerId!, this.dealerForm.value).subscribe(() => {
          alert('Dealer updated successfully!');
          this.router.navigate(['/dealer-list']);
        });
      } else {
        // 🔹 Create new dealer
        this.dealerService.createDealer(this.dealerForm.value).subscribe(() => {
          alert('Dealer registered successfully!');
          this.router.navigate(['/dealer-list']);
        });
      }
    }
  }

  cancelEdit() {
    this.router.navigate(['/dealer-list']);
  }
}
