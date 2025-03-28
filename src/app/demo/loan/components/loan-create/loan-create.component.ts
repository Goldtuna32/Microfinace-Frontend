import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, FormsModule } from '@angular/forms';
import { LoanService } from '../../services/loan.service';
import { CollateralService } from 'src/app/demo/collateral/services/collateral.service';
import { Router } from '@angular/router';
import { LoanRegistrationRequest } from '../../models/LoanRegistrationRequest.model';
import { SmeLoanCollateral } from '../../models/SmeLoanCollateral.model';
import { SmeLoanRegistration } from '../../models/SmeLoanRegistration.model';
import { AlertService } from 'src/app/alertservice/alert.service';

@Component({
  selector: 'app-loan-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './loan-create.component.html',
  styleUrls: ['./loan-create.component.scss']
})
export class LoanCreateComponent implements OnInit {
  loanForm!: FormGroup;
  cifs: any[] = [];
  filteredCifs: any[] = [];
  currentAccounts: any[] = [];
  collaterals: any[] = [];
  showSuccessMessage = false;
  errorMessage: string | null = null;
  showCifDropdown = false;
  cifSearchInput = '';

  constructor(
    private fb: FormBuilder,
    private collateralService: CollateralService,
    private loanService: LoanService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCifs();

     // Add this to watch loan amount changes
  this.loanForm.get('loanAmount')?.valueChanges.subscribe(() => {
    this.calculateLTV();
  });
  }

  private initForm(): void {
    this.loanForm = this.fb.group({
      cifId: ['', Validators.required],
      currentAccountId: ['', Validators.required], // Ensure this is included
      loanAmount: ['', [Validators.required, Validators.min(0)]],
      interestRate: ['', [Validators.required, Validators.min(0)]],
      late_fee_rate: ['', [Validators.required, Validators.min(0)]], // Added
      ninety_day_late_fee_rate: ['', [Validators.required, Validators.min(0)]], // Added
      one_hundred_and_eighty_late_fee_rate: ['', [Validators.required, Validators.min(0)]], // Added
      gracePeriod: ['', [Validators.required, Validators.min(0)]],
      repaymentDuration: ['', [Validators.required, Validators.min(1)]],
      documentFee: ['', [Validators.required, Validators.min(0)]],
      serviceCharges: ['', [Validators.required, Validators.min(0)]],
      status: [1, Validators.required],
      dueDate: [''],
      repaymentStartDate: [''],
      collaterals: this.fb.array([this.createCollateralGroup()])
    });

    (this.loanForm.get('collaterals') as FormArray).valueChanges.subscribe(() => this.updateTotalCollateralAmount());
  }

  private createCollateralGroup(collateralId?: number): FormGroup {
    return this.fb.group({
      collateralId: [collateralId || '', Validators.required]
    });
  }

  get collateralControls() {
    return (this.loanForm.get('collaterals') as FormArray).controls;
  }

  get totalCollateralAmount(): number {
    return this.collateralControls.reduce((sum, control) => {
      const collateralId = Number(control.get('collateralId')?.value);
      const collateral = this.collaterals.find(c => c.id === collateralId);
      return sum + (collateral ? Number(collateral.value) : 0);
    }, 0);
  }

  getCollateralValue(control: any): number | undefined {
    const collateralId = Number(control.get('collateralId')?.value);
    const collateral = this.collaterals.find(c => c.id === collateralId);
    return collateral ? Number(collateral.value) : undefined;
  }

  // Enhanced version with validation
calculateLTV(): number {
  const loanAmount = Number(this.loanForm.get('loanAmount')?.value) || 0;
  const totalCollateral = this.totalCollateralAmount;
  
  // Prevent division by zero
  if (totalCollateral <= 0) {
    return 0;
  }
  
  const ltv = loanAmount / totalCollateral;
  
  // Validate against maximum acceptable LTV (e.g., 80%)
  const maxLtv = 0.8; // 80%
  if (ltv > maxLtv) {
    this.errorMessage = `Warning: LTV ratio (${(ltv * 100).toFixed(2)}%) exceeds maximum recommended (${maxLtv * 100}%)`;
  } else {
    this.errorMessage = null;
  }
  
  return ltv;
}

  getAvailableCollaterals(index: number): any[] {
    const selectedIds = this.collateralControls
      .filter((_, i) => i !== index)
      .map(control => Number(control.get('collateralId')?.value))
      .filter(id => id);
    return this.collaterals.filter(collateral => !selectedIds.includes(collateral.id));
  }

  addCollateral(): void {
    (this.loanForm.get('collaterals') as FormArray).push(this.createCollateralGroup());
  }

  removeCollateral(index: number): void {
    const collaterals = this.loanForm.get('collaterals') as FormArray;
    if (collaterals.length > 1) {
      collaterals.removeAt(index);
    }
  }

  loadCifs(): void {
    this.collateralService.getAllCifs().subscribe({
      next: (data) => {
        console.log('CIFs Loaded:', data); // Debug log
        this.cifs = data;
        this.filteredCifs = data.slice(0, 10);
      },
      error: (error) => this.errorMessage = 'Failed to load CIFs: ' + error.message
    });
  }

  filterCifs(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input) {
      this.cifSearchInput = input.value;
      const searchLower = this.cifSearchInput.toLowerCase();
      this.filteredCifs = this.cifs.filter(cif =>
        (cif.serialNumber || '').toLowerCase().includes(searchLower) // Adjust 'serialNumber' to actual field
      ).slice(0, 10);
      this.showCifDropdown = true;
    }
  }

  selectCif(cif: any): void {
    console.log('Selected CIF:', cif); // Debug log to inspect the CIF object
  
    const serialNumber = cif?.serialNumber || 'N/A';
    const cifId = cif?.id || null;
  
    if (!cifId) {
      console.error('Invalid CIF object: Missing ID', cif);
      this.errorMessage = 'Invalid CIF selected. Please try again.';
      return;
    }
  
    // Update search input and form
    this.cifSearchInput = serialNumber;
    this.loanForm.patchValue({ cifId: cifId });
    this.showCifDropdown = false;
  
    // Fetch related data
    this.loadCurrentAccountsByCifId(cifId);
    this.loadCollaterals(cifId);
  }

  toggleCifDropdown(): void {
    this.showCifDropdown = !this.showCifDropdown;
    if (this.showCifDropdown && !this.cifSearchInput) {
      this.filteredCifs = this.cifs.slice(0, 10);
    }
  }

  closeDropdowns(): void {
    setTimeout(() => {
      this.showCifDropdown = false;
    }, 200);
  }

  // loan-create.component.ts
  private loadCurrentAccountsByCifId(cifId: number): void {
    console.log('Loading current accounts for CIF ID:', cifId);
    this.currentAccounts = []; // Reset to empty array
    this.cdr.detectChanges(); // Update UI immediately
  
    this.collateralService.getCurrentAccountsByCifId(cifId).subscribe({
      next: (data) => {
        console.log('Current Accounts Received:', data);
        let accounts: any[];
        
        if (Array.isArray(data)) {
          // If data is already an array, use it
          accounts = data;
        } else if (data && typeof data === 'object') {
          // If data is a single object, wrap it in an array
          accounts = [data];
        } else {
          // Fallback for null, undefined, or unexpected types
          accounts = [];
        }
  
        this.currentAccounts = accounts.length > 0 ? accounts : [];
        this.cdr.detectChanges(); // Force UI update
  
        if (this.currentAccounts.length > 0) {
          this.loanForm.patchValue({ currentAccountId: this.currentAccounts[0].id });
          console.log('Set currentAccountId to:', this.currentAccounts[0].id);
        } else {
          this.errorMessage = 'No current accounts found for this CIF ID.';
          this.loanForm.get('currentAccountId')?.setErrors({ noAccounts: true });
          console.log('No current accounts available');
        }
      },
      error: (error) => {
        this.errorMessage = 'Failed to load current accounts: ' + error.message;
        console.error('Error loading current accounts:', error);
        this.currentAccounts = []; // Reset on error
        this.cdr.detectChanges();
      },
    });
  }

  
  
  private loadCollaterals(cifId: number): void {
    console.log('Loading collaterals for CIF ID:', cifId);
    this.collaterals = []; // Reset to empty array
    this.cdr.detectChanges(); // Update UI
  
    this.collateralService.getCollateralsByCifId(cifId).subscribe({
      next: (data) => {
        console.log('Collaterals Received:', data);
        this.collaterals = Array.isArray(data) ? data : []; // Ensure array
        const collateralsArray = this.loanForm.get('collaterals') as FormArray;
        collateralsArray.clear();
        
        // Optionally pre-populate with fetched collaterals (if desired)
        if (this.collaterals.length > 0) {
          this.collaterals.forEach(coll => {
            collateralsArray.push(this.createCollateralGroup(coll.id));
          });
        } else {
          collateralsArray.push(this.createCollateralGroup()); // Default empty row
        }
        
        this.cdr.detectChanges(); // Force UI update
      },
      error: (error) => {
        this.errorMessage = 'Failed to load collaterals: ' + error.message;
        console.error('Error loading collaterals:', error);
        this.collaterals = [];
        this.cdr.detectChanges();
      },
    });
  }

  updateTotalCollateralAmount(): void {
    const total = this.totalCollateralAmount;
    const loanAmount = Number(this.loanForm.get('loanAmount')?.value);
    
    // Calculate LTV
    this.calculateLTV();
    
    if (loanAmount && loanAmount > total) {
      this.errorMessage = `Loan amount cannot exceed total collateral amount: ${total.toLocaleString()}`;
    } else if (!this.errorMessage) { // Only clear if there's no LTV error
      this.errorMessage = null;
    }
  }

  onSubmit(): void {
    if (this.loanForm.valid && this.collateralControls.every(control => control.valid)) {
      const formValue = this.loanForm.value;
      console.log('Form Value:', formValue);
  
      const totalCollateralAmount = this.totalCollateralAmount;
      if (Number(formValue.loanAmount) > totalCollateralAmount) {
        this.errorMessage = 'Loan amount cannot exceed total collateral amount: ' + totalCollateralAmount.toLocaleString();
        return;
      }
  
      const loan: SmeLoanRegistration = {
        loanAmount: Number(formValue.loanAmount),
        interestRate: Number(formValue.interestRate),
        late_fee_rate: Number(formValue.late_fee_rate), // Added
        ninety_day_late_fee_rate: Number(formValue.ninety_day_late_fee_rate), // Added
        one_hundred_and_eighty_day_late_fee_rate: Number(formValue.one_hundred_and_eighty_late_fee_rate), // Added
        gracePeriod: Number(formValue.gracePeriod),
        repaymentDuration: Number(formValue.repaymentDuration),
        documentFee: Number(formValue.documentFee),
        serviceCharges: Number(formValue.serviceCharges),
        status: 3,
        dueDate: formValue.dueDate || undefined,
        repaymentStartDate: formValue.repaymentStartDate || undefined,
        currentAccountId: Number(formValue.currentAccountId)
      };
  
      const collaterals: SmeLoanCollateral[] = formValue.collaterals
        .filter((c: any) => c.collateralId && Number(c.collateralId) > 0)
        .map((c: any) => {
          const collateralId = Number(c.collateralId);
          const collateral = this.collaterals.find(coll => coll.id === collateralId);
          console.log('Collateral ID from form:', collateralId, 'Found Collateral:', collateral);
          return {
            collateralId: collateralId, // Flat field, not nested
            collateralAmount: collateral ? Number(collateral.value) : 0
          };
        });
  
      if (collaterals.length === 0) {
        this.errorMessage = 'At least one valid collateral is required.';
        return;
      }
  
      const request: LoanRegistrationRequest = { loan, collaterals };
      console.log('Request Payload:', JSON.stringify(request));
  
      this.loanService.registerLoan(request).subscribe({
        next: () => {
          this.showSuccessMessage = true;
          this.alertService.showSuccess('Loan registration successful.');
          setTimeout(() => {
            this.showSuccessMessage = false;
            this.router.navigate(['/loans']);
          }, 2000);
        },
        error: (error) => this.errorMessage = 'Failed to register loan: ' + error.message
      });
    } else {
      this.errorMessage = 'Please fill all required fields correctly, including valid collaterals.';
      Object.keys(this.loanForm.controls).forEach(key => {
        const control = this.loanForm.get(key);
        if (control?.invalid) control.markAsTouched();
      });
      (this.loanForm.get('collaterals') as FormArray).controls.forEach(control => {
        if (control.invalid) control.markAsTouched();
      });
    }
  }
}