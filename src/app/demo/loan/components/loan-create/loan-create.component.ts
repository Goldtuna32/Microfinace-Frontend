import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, FormsModule } from '@angular/forms';
import { LoanService } from '../../services/loan.service';
import { CollateralService } from 'src/app/demo/collateral/services/collateral.service';
import { Router } from '@angular/router';
import { LoanRegistrationRequest } from '../../models/LoanRegistrationRequest.model';
import { SmeLoanCollateral } from '../../models/SmeLoanCollateral.model';
import { SmeLoanRegistration } from '../../models/SmeLoanRegistration.model';

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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCifs();
  }

  private initForm(): void {
    this.loanForm = this.fb.group({
      cifId: ['', Validators.required],
      currentAccountId: ['', Validators.required], // Ensure this is included
      loanAmount: ['', [Validators.required, Validators.min(0)]],
      interestRate: ['', [Validators.required, Validators.min(0)]],
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

  private createCollateralGroup(): FormGroup {
    return this.fb.group({
      collateralId: ['', Validators.required]
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
    console.log('Selected CIF:', cif); // Debug log
  this.cifSearchInput = cif.serialNumber || '';
  this.loanForm.patchValue({ cifId: cif.id });
  this.showCifDropdown = false;
  this.loadCurrentAccountsByCifId(cif.id); // Fetch current accounts
  this.loadCollaterals(cif.id);
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
    this.collateralService.getCurrentAccountsByCifId(cifId).subscribe({
      next: (data) => {
        console.log('Current Accounts Received:', data);
        this.currentAccounts = data || []; // Ensure empty array if no data
        this.cdr.detectChanges(); // Force UI update
        if (data && data.length > 0) {
          this.loanForm.patchValue({ currentAccountId: data[0].id });
          console.log('Set currentAccountId to:', data[0].id);
        } else {
          this.errorMessage = 'No current accounts found for this CIF ID.';
          this.loanForm.get('currentAccountId')?.setErrors({ noAccounts: true });
          console.log('No current accounts available');
        }
      },
      error: (error) => {
        this.errorMessage = 'Failed to load current accounts: ' + error.message;
        console.error('Error loading current accounts:', error);
      }
    });
  }
  
  private loadCollaterals(cifId: number): void {
    this.collateralService.getCollateralsByCifId(cifId).subscribe({
      next: (data) => {
        this.collaterals = data;
        const collateralsArray = this.loanForm.get('collaterals') as FormArray;
        collateralsArray.clear();
        collateralsArray.push(this.createCollateralGroup());
      },
      error: (error) => this.errorMessage = 'Failed to load collaterals: ' + error.message
    });
  }

  updateTotalCollateralAmount(): void {
    const total = this.totalCollateralAmount;
    const loanAmount = Number(this.loanForm.get('loanAmount')?.value);
    if (loanAmount && loanAmount > total) {
      this.errorMessage = 'Loan amount cannot exceed total collateral amount: ' + total.toLocaleString();
    } else {
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
        gracePeriod: Number(formValue.gracePeriod),
        repaymentDuration: Number(formValue.repaymentDuration),
        documentFee: Number(formValue.documentFee),
        serviceCharges: Number(formValue.serviceCharges),
        status: formValue.status,
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