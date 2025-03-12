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
  
    if (this.isEditMode) {
      this.loadDealerData();
    }
  }
  
  loadDealerData() {
    if (!this.dealerId) return;
    this.dealerService.getDealerById(this.dealerId).subscribe(dealer => {
      this.dealerForm.patchValue(dealer);
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
