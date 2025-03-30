import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SmeLoanCollateral } from '../../models/SmeLoanCollateral.model';
import { SmeLoanRegistration } from '../../models/SmeLoanRegistration.model';
import { LoanService } from '../../services/loan.service';
import { CommonModule } from '@angular/common';
import { CollateralService } from 'src/app/demo/collateral/services/collateral.service';

export type CollateralStatus = 1 | 0;

export interface Collateral {
  id?: number;
  collateralCode: string;
  description: string;
  value: number;
  f_collateral_photo: string;
  b_collateral_photo: string;
  status: CollateralStatus;
  date: string;
  
}


@Component({
  selector: 'app-loan-edit',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './loan-edit.component.html',
  styleUrl: './loan-edit.component.scss'
})
export class LoanEditComponent implements OnInit {
  loanForm: FormGroup;
  loanId: number | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  originalLoan: SmeLoanRegistration | null = null;
  cifCollaterals: Collateral[] = [];
  availableCollaterals: SmeLoanCollateral[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private loanService: LoanService,
    private collateralService: CollateralService
  ) {
    this.loanForm = this.fb.group({
      loanAmount: ['', [Validators.required, Validators.min(1)]],
      interestRate: ['', [Validators.required, Validators.min(0)]],
      gracePeriod: ['', [Validators.required, Validators.min(0)]],
      repaymentDuration: ['', [Validators.required, Validators.min(1)]],
      documentFee: ['', [Validators.required, Validators.min(0)]],
      serviceCharges: ['', [Validators.required, Validators.min(0)]],
      dueDate: [''],
      repaymentStartDate: [''],
      collaterals: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loanId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.loanId) {
      this.loadLoanDetails(this.loanId);
    } else {
      this.errorMessage = 'Invalid loan ID';
    }
  }

  get collaterals(): FormArray {
    return this.loanForm.get('collaterals') as FormArray;
  }

  addCollateral(collateral?: SmeLoanCollateral | Collateral): void {
    let collateralId = collateral?.id || '';
    let collateralValue = collateral && 'value' in collateral ? collateral.value :
                         collateral ? (collateral as SmeLoanCollateral).collateralAmount : 0;
  
    // If no collateral object is provided (e.g., from dropdown), use cifCollaterals
    if (!collateral && collateralId) {
      const numericId = Number(collateralId);
      const selectedCollateral = this.cifCollaterals.find(coll => coll.id === numericId);
      collateralValue = selectedCollateral ? selectedCollateral.value : 0;
    }
  
    // Duplicate checks
    const numericId = Number(collateralId);
    const isCifCollateral = this.cifCollaterals.some(coll => coll.id === numericId);
    if (collateralId && !isCifCollateral) {
      this.errorMessage = `Collateral with ID ${collateralId} is not associated with the CIF account.`;
      return;
    }
  
    const isDuplicateInForm = this.collaterals.controls.some(control =>
      control.get('collateralId')?.value === collateralId
    );
    const isDuplicateInLoan = this.originalLoan?.collaterals?.some(coll =>
      coll.collateralId === collateralId
    );
  
    if (isDuplicateInForm || isDuplicateInLoan) {
      this.errorMessage = `Collateral with ID ${collateralId} already exists in the loan or the current list.`;
      return;
    }
  
    // Ensure collateralValue is valid
    if (collateralValue <= 0) {
      this.errorMessage = `Collateral ID ${collateralId} has an invalid amount (${collateralValue}).`;
      return;
    }
  
    const collateralGroup = this.fb.group({
      collateralId: [collateralId, Validators.required],
      collateralAmount: [{ value: collateralValue, disabled: true }, [Validators.required, Validators.min(1)]]
    });
  
    // Update amount when collateralId changes (for dropdown selections)
    collateralGroup.get('collateralId')?.valueChanges.subscribe(id => {
      const numericId = Number(id);
      const selectedCollateral = this.cifCollaterals.find(coll => coll.id === numericId);
      if (selectedCollateral) {
        collateralGroup.get('collateralAmount')?.patchValue(selectedCollateral.value, { emitEvent: false });
      } else {
        collateralGroup.get('collateralAmount')?.patchValue(0, { emitEvent: false });
      }
    });
  
    this.collaterals.push(collateralGroup);
    this.errorMessage = null;
  }

  removeCollateral(index: number): void {
    this.collaterals.removeAt(index);
  }

  updateCollateralDisplay(): void {
    this.collaterals.controls.forEach(control => {
      const id = Number(control.get('collateralId')?.value);
      const cifColl = this.cifCollaterals.find(c => c.id === id);
      if (cifColl) {
        control.get('collateralAmount')?.patchValue(cifColl.value, { emitEvent: false });
      }
      console.log('Updated Form Collaterals:', this.collaterals.value);
    });
  }

  getCollateralDescription(collateralId: string | number): string {
    const id = Number(collateralId);
    const collateral = this.cifCollaterals.find(coll => coll.id === id);
    return collateral ? collateral.description : 'Unknown Collateral';
  }

  loadLoanDetails(id: number): void {
    this.loanService.getLoanById(id).subscribe({
      next: (loan) => {
        this.originalLoan = loan;
        this.loanForm.patchValue({
          loanAmount: loan.loanAmount,
          interestRate: loan.interestRate,
          gracePeriod: loan.gracePeriod,
          repaymentDuration: loan.repaymentDuration,
          documentFee: loan.documentFee,
          serviceCharges: loan.serviceCharges,
          dueDate: loan.dueDate ? new Date(loan.dueDate).toISOString().substring(0, 10) : '',
          repaymentStartDate: loan.repaymentStartDate ? new Date(loan.repaymentStartDate).toISOString().substring(0, 10) : ''
        });
  
        this.collaterals.clear();
  
        if (loan.collaterals && loan.collaterals.length > 0) {
          console.log('Loan Collaterals:', loan.collaterals);
          // Store the loan collaterals with their descriptions
          this.loanCollaterals = loan.collaterals; // Add this as a class property
          loan.collaterals.forEach(coll => this.addCollateralWithDescription(coll));
        } else {
          console.log('No collaterals found in loan data');
        }
  
        if (loan.cif?.id) {
          this.loadCifCollaterals(loan.cif.id).then(() => {
            this.updateCollateralDisplay();
          });
        } else {
          this.errorMessage = 'CIF ID not found for this loan';
        }
      },
      error: (error) => {
        this.errorMessage = 'Failed to load loan details: ' + error.message;
        console.error('Loan Details Error:', error);
      }
    });
  }

  loanCollaterals: any[] = []; // Adjust the type based on your data structure

// Create a new method to handle adding collaterals with descriptions
addCollateralWithDescription(collateral: any): void { // Adjust the type as needed
  const collateralId = collateral.collateralId || '';
  const collateralValue = collateral.collateralAmount || 0;
  const description = collateral.description || '';

  const collateralGroup = this.fb.group({
    collateralId: [collateralId, Validators.required],
    collateralAmount: [{ value: collateralValue, disabled: true }, [Validators.required, Validators.min(1)]],
    description: [description] // Add description to the form group
  });

  // Update amount when collateralId changes (optional, if needed for new collaterals)
  collateralGroup.get('collateralId')?.valueChanges.subscribe(id => {
    const numericId = Number(id);
    const selectedCollateral = this.cifCollaterals.find(coll => coll.id === numericId);
    if (selectedCollateral) {
      collateralGroup.get('collateralAmount')?.patchValue(selectedCollateral.value, { emitEvent: false });
      collateralGroup.get('description')?.patchValue(selectedCollateral.description, { emitEvent: false });
    } else {
      collateralGroup.get('collateralAmount')?.patchValue(0, { emitEvent: false });
      collateralGroup.get('description')?.patchValue('Unknown Collateral', { emitEvent: false });
    }
    console.log('Collateral ID changed to:', numericId, 'Form Value:', this.collaterals.value);
  });

  this.collaterals.push(collateralGroup);
}
  
loadCifCollaterals(cifId: number): Promise<void> {
  return new Promise((resolve, reject) => {
    this.collateralService.getAllCollateralsForCif(cifId).subscribe({
      next: (collaterals: any[]) => { // Use any[] to avoid immediate type checking
        this.cifCollaterals = collaterals.map(coll => ({
          id: coll.id ?? 0, // Nullish coalescing for undefined/null
          collateralCode: coll.collateralCode ?? '',
          description: coll.description ?? '',
          value: coll.value ?? 0,
          f_collateral_photo: coll.f_collateral_photo ?? '',
          b_collateral_photo: coll.b_collateral_photo ?? '',
          status: Number(coll.status) || 1, // Ensure it's a number, default to 1
          date: coll.date ?? new Date().toISOString().split('T')[0],
          cifId: coll.cifId,
          collateralTypeId: coll.collateralTypeId
        })) as Collateral[]; // Cast the final array
        
        console.log('Loaded CIF Collaterals:', this.cifCollaterals);
        this.updateCollateralDisplay();
        resolve();
      },
      error: (error) => {
        this.errorMessage = 'Failed to load CIF collaterals: ' + error.message;
        console.error('CIF Collaterals Error:', error);
        reject(error);
      }
    });
  });
}

  getAvailableCollaterals(): Collateral[] {
    const selectedIds = this.collaterals.controls
      .map(control => {
        const id = control.get('collateralId')?.value;
        return id ? Number(id) : null;
      })
      .filter(id => id !== null && !isNaN(id)) as number[];
  
    const originalLoanCollateralIds = this.originalLoan?.collaterals?.map(coll => coll.collateralId) || [];
  
    // Combine selected IDs from form and original loan to avoid duplicates
    const allUsedIds = [...new Set([...selectedIds, ...originalLoanCollateralIds])];
  
    return this.cifCollaterals.filter(
      collateral => collateral.id && !allUsedIds.includes(collateral.id)
    );
  }

  onSubmit(): void {
    if (this.loanForm.valid && this.loanId && this.originalLoan) {
      console.log('Raw Collaterals from Form:', this.collaterals.value); // Log raw form data
  
      const updatedCollaterals: SmeLoanCollateral[] = this.loanForm.value.collaterals.map((coll: any) => {
        const collateralId = Number(coll.collateralId);
        const collateralAmount = Number(coll.collateralAmount);
  
        console.log(`Processing Collateral ID ${collateralId}: collateralAmount = ${coll.collateralAmount}, converted = ${collateralAmount}`); // Debug each collateral
  
        const isValidCifCollateral = this.cifCollaterals.some(c => c.id === collateralId);
        const isValidOriginalCollateral = this.originalLoan?.collaterals?.some(c => c.collateralId === collateralId);
  
        if (!isValidCifCollateral && !isValidOriginalCollateral) {
          this.errorMessage = `Collateral ID ${collateralId} is not valid for this loan.`;
          throw new Error(this.errorMessage);
        }
  
        if (isNaN(collateralAmount) || collateralAmount <= 0) {
          this.errorMessage = `Invalid collateral amount for ID ${collateralId}`;
          throw new Error(this.errorMessage);
        }
  
        return { collateralId: collateralId, collateralAmount: collateralAmount };
      });
  
      const totalCollateralAmount = this.collaterals.value.reduce((sum: number, coll: any) => sum + Number(coll.collateralAmount), 0);
      const loanAmount = Number(this.loanForm.value.loanAmount);
  
      if (isNaN(totalCollateralAmount)) {
        this.errorMessage = 'Total collateral amount is invalid (NaN)';
        throw new Error(this.errorMessage);
      }
  
      const updatedLoan: SmeLoanRegistration = {
        id: this.loanId,
        loanAmount: loanAmount,
        interestRate: this.loanForm.value.interestRate,
        late_fee_rate: this.loanForm.value.late_fee_rate,
        ninety_day_late_fee_rate: this.loanForm.value.ninety_day_late_fee_rate,
        one_hundred_and_eighty_day_late_fee_rate: this.loanForm.value.one_hundred_and_eighty_day_late_fee_rate,
        gracePeriod: this.loanForm.value.gracePeriod,
        repaymentDuration: this.loanForm.value.repaymentDuration,
        documentFee: this.loanForm.value.documentFee,
        serviceCharges: this.loanForm.value.serviceCharges,
        dueDate: this.loanForm.value.dueDate ? new Date(this.loanForm.value.dueDate).toISOString() : undefined,
        repaymentStartDate: this.loanForm.value.repaymentStartDate ? new Date(this.loanForm.value.repaymentStartDate).toISOString() : undefined,
        collaterals: updatedCollaterals,
        status: this.originalLoan.status,
        currentAccountId: this.originalLoan.currentAccountId,
        totalCollateralAmount: totalCollateralAmount,
        accountNumber: this.originalLoan.accountNumber,
        cif: this.originalLoan.cif
      };
  
      console.log('Loan Amount:', loanAmount);
      console.log('Total Collateral Amount:', totalCollateralAmount);
      console.log('Updated Loan:', updatedLoan);
  
      this.loanService.updateLoan(this.loanId, updatedLoan).subscribe({
        next: () => {
          this.successMessage = 'Loan updated successfully!';
          setTimeout(() => {
            this.successMessage = null;
            this.router.navigate(['/loans']);
          }, 2000);
        },
        error: (error) => {
          this.errorMessage = 'Failed to update loan: ' + error.message;
          console.error('Submission Error:', error);
        }
      });
    } else {
      this.errorMessage = 'Please fill all required fields correctly.';
      this.loanForm.markAllAsTouched();
      console.log('Form Invalid:', this.loanForm.value);
    }
  }

  goBack(): void {
    this.router.navigate(['/loan/list']);
  }
}