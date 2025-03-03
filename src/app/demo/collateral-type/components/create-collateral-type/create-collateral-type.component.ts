import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CollateralTypeService } from '../../services/collateral-type.service';
import { Router } from '@angular/router';
import { CollateralType } from '../../models/collateralType.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-collateral-type',
  imports: [ ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './create-collateral-type.component.html',
  styleUrl: './create-collateral-type.component.scss'
})
export class CreateCollateralTypeComponent {
  collateralType: CollateralType = {
    name: '',
    status: 1 // Default to active as per backend
  };
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private collateralService: CollateralTypeService,
    private router: Router
  ) {}

  createCollateralType(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (!this.collateralType.name.trim()) {
      this.errorMessage = 'Name is required';
      return;
    }

    this.collateralService.createCollateralType(this.collateralType).subscribe({
      next: (response) => {
        this.successMessage = `Collateral Type "${response.name}" created successfully with ID: ${response.id}`;
        this.collateralType = { name: '', status: 1 }; // Reset form
      },
      error: (err) => {
        this.errorMessage = `Failed to create collateral type: ${err.message}`;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/collateral-types']); // Adjust route as needed
  }
}
