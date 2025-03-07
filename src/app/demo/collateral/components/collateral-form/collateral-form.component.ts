import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { CollateralService } from '../../services/collateral.service';
import { Router } from '@angular/router';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { CollateralType } from 'src/app/demo/collateral-type/models/collateralType.model';

@Component({
  selector: 'app-collateral-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgbTypeaheadModule],
  templateUrl: './collateral-form.component.html',
  styleUrl: './collateral-form.component.scss'
})
export class CollateralFormComponent implements OnInit {
  showSuccessMessage = false;
  showCifDropdown = false;
  cifSearchInput = '';
  showCollateralTypeDropdown = false;
  collateralTypeSearchInput = '';
  frontPhotoPreview: string | null = null;
  backPhotoPreview: string | null = null;
  collateralForm!: FormGroup;
  cifs: any[] = [];
  filteredCifs: any[] = [];
  collateralTypes: CollateralType[] = [];
  filteredCollateralTypes: CollateralType[] = [];
  today: string = new Date().toISOString().split('T')[0];

  constructor(
    private fb: FormBuilder,
    private collateralService: CollateralService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCifs();
    this.loadCollateralTypes();
  }

  private initForm(): void {
    this.collateralForm = this.fb.group({
      value: ['', [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      status: [1, Validators.required],
      cifId: ['', Validators.required],
      collateralTypeId: ['', Validators.required],
      F_collateralPhoto: [null, Validators.required],
      B_collateralPhoto: [null, Validators.required],
      collateralCode: ['AUTO', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.collateralForm.valid) {
      const formData = new FormData();
      formData.append('value', this.collateralForm.get('value')?.value);
      formData.append('description', this.collateralForm.get('description')?.value);
      formData.append('status', this.collateralForm.get('status')?.value);
      formData.append('cifId', this.collateralForm.get('cifId')?.value);
      formData.append('collateralTypeId', this.collateralForm.get('collateralTypeId')?.value);
      const frontPhoto = this.collateralForm.get('F_collateralPhoto')?.value;
      const backPhoto = this.collateralForm.get('B_collateralPhoto')?.value;
      if (frontPhoto) formData.append('F_collateralPhoto', frontPhoto);
      if (backPhoto) formData.append('B_collateralPhoto', backPhoto);

      this.collateralService.createCollateral(formData).subscribe({
        next: () => {
          this.showSuccessMessage = true;
          setTimeout(() => {
            this.showSuccessMessage = false;
            this.router.navigate(['/collateral']);
          }, 2000);
        },
        error: (error) => console.error('Error creating collateral:', error)
      });
    } else {
      console.error('Form is invalid');
      Object.keys(this.collateralForm.controls).forEach(key => {
        const control = this.collateralForm.get(key);
        if (control?.invalid) control.markAsTouched();
      });
    }
  }

  private loadCifs(): void {
    this.collateralService.getAllCifs().subscribe({
      next: (data) => {
        this.cifs = data;
        this.filteredCifs = data.slice(0, 10); // Initial display
      },
      error: (error) => console.error('Error loading CIFs:', error)
    });
  }

  private loadCollateralTypes(): void {
    this.collateralService.getAllActiveCollateralTypes().subscribe({
      next: (data) => {
        this.collateralTypes = data;
        this.filteredCollateralTypes = data.slice(0, 10); // Initial display
      },
      error: (error) => console.error('Error loading collateral types:', error)
    });
  }

  onFrontPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.collateralForm.patchValue({ F_collateralPhoto: file });
      const reader = new FileReader();
      reader.onload = () => this.frontPhotoPreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  onBackPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.collateralForm.patchValue({ B_collateralPhoto: file });
      const reader = new FileReader();
      reader.onload = () => this.backPhotoPreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  filterCifs(event: any): void {
    this.cifSearchInput = event.target.value;
    const search = this.cifSearchInput.toLowerCase();
    this.filteredCifs = this.cifs.filter(cif =>
      cif.name.toLowerCase().includes(search) || cif.nrcNumber.toLowerCase().includes(search)
    ).slice(0, 10);
    this.showCifDropdown = true;
  }

  selectCif(cif: any): void {
    this.cifSearchInput = `${cif.name} - ${cif.nrcNumber}`;
    this.collateralForm.patchValue({ cifId: cif.id });
    this.showCifDropdown = false;
    console.log('Selected CIF:', cif, 'Form Value:', this.collateralForm.value);
  }

  toggleCifDropdown(): void {
    this.showCifDropdown = !this.showCifDropdown;
    if (this.showCifDropdown && !this.cifSearchInput) {
      this.filteredCifs = this.cifs.slice(0, 10);
    }
  }

  filterCollateralTypes(event: any): void {
    this.collateralTypeSearchInput = event.target.value;
    const search = this.collateralTypeSearchInput.toLowerCase();
    this.filteredCollateralTypes = this.collateralTypes.filter(type =>
      type.name.toLowerCase().includes(search)
    ).slice(0, 10);
    this.showCollateralTypeDropdown = true;
    console.log('Filtered Collateral Types:', this.filteredCollateralTypes);
  }

  selectCollateralType(type: CollateralType): void {
    this.collateralTypeSearchInput = type.name;
    this.collateralForm.patchValue({ collateralTypeId: type.id });
    this.showCollateralTypeDropdown = false;
    console.log('Selected Collateral Type:', type, 'Form Value:', this.collateralForm.value);
  
  }

  toggleCollateralTypeDropdown(): void {
    this.showCollateralTypeDropdown = !this.showCollateralTypeDropdown;
    if (this.showCollateralTypeDropdown && !this.collateralTypeSearchInput) {
      this.filteredCollateralTypes = this.collateralTypes.slice(0, 10);
    }
  }

  onBlur(): void {
    setTimeout(() => {
      this.showCifDropdown = false;
      this.showCollateralTypeDropdown = false;
    }, 200);
  }

  closeDropdowns(): void {
    setTimeout(() => {
      this.showCifDropdown = false;
      this.showCollateralTypeDropdown = false;
    }, 200);
  }
}
