import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { CollateralService } from '../../services/collateral.service';
import { Router } from '@angular/router';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { CollateralType } from 'src/app/demo/collateral-type/models/collateralType.model';
import { UserService } from 'src/app/demo/users/services/user.service';
import { CifService } from 'src/app/demo/cif/services/cif.service';
import { CollateralTypeService } from 'src/app/demo/collateral-type/services/collateral-type.service';

@Component({
  selector: 'app-collateral-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgbTypeaheadModule],
  templateUrl: './collateral-form.component.html',
  styleUrl: './collateral-form.component.scss'
})
export class CollateralFormComponent implements OnInit {
  @ViewChild('frontPhotoInput') frontPhotoInput!: ElementRef;
  @ViewChild('backPhotoInput') backPhotoInput!: ElementRef;

  showSuccessMessage = false;
  showCifDropdown = false;
  cifSearchInput = '';
  showCollateralTypeDropdown = false;
  branchId: number | null = null;
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
    private userService: UserService, 
    private cifService: CifService, 
    private clTypeService: CollateralTypeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCurrentUserBranch();
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

  loadCurrentUserBranch(): void {
    this.userService.currentUser$.subscribe({
      next: (user) => {
        this.branchId = user?.branchId || null;
        this.loadCifs();
        this.loadCollateralTypes();
      },
      error: (error) => {
        console.error('Failed to load user branch', error);
        this.loadCifs();
        this.loadCollateralTypes();
      }
    });

    if (!this.userService.currentUserSubject.value) {
      this.userService.getCurrentUser().subscribe();
    }
  }

  onSubmit(): void {
    if (this.collateralForm.valid) {
      const formData = new FormData();
      Object.keys(this.collateralForm.value).forEach(key => {
        if (key !== 'F_collateralPhoto' && key !== 'B_collateralPhoto') {
          formData.append(key, this.collateralForm.get(key)?.value);
        }
      });

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
      this.markAllAsTouched();
    }
  }

  private markAllAsTouched(): void {
    Object.keys(this.collateralForm.controls).forEach(key => {
      const control = this.collateralForm.get(key);
      if (control?.invalid) control.markAsTouched();
    });
  }

  private loadCifs(branchId?: number): void {
    this.cifService.getAllCIFs(branchId).subscribe({
      next: (data) => {
        this.cifs = data;
        this.filteredCifs = data.slice(0, 10);
      },
      error: (error) => console.error('Error loading CIFs:', error)
    });
  }

  private loadCollateralTypes(branchId?: number): void {
    this.clTypeService.getActiveCollateralTypes().subscribe({
      next: (data) => {
        this.collateralTypes = data;
        this.filteredCollateralTypes = data.slice(0, 10);
      },
      error: (error) => console.error('Error loading collateral types:', error)
    });
  }

  filterCifsBySerialNumber(event: any): void {
    this.cifSearchInput = event.target.value;
    const search = this.cifSearchInput.toLowerCase();
    this.filteredCifs = this.cifs.filter(cif =>
      cif.serialNumber.toLowerCase().includes(search)
    ).slice(0, 10);
    this.showCifDropdown = true;
  }

  selectCif(cif: any): void {
    this.cifSearchInput = cif.serialNumber;
    this.collateralForm.patchValue({ cifId: cif.id });
    this.showCifDropdown = false;
  }

  onFrontPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.collateralForm.patchValue({ F_collateralPhoto: file });
      this.collateralForm.get('F_collateralPhoto')?.markAsTouched();
      const reader = new FileReader();
      reader.onload = () => this.frontPhotoPreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  onBackPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.collateralForm.patchValue({ B_collateralPhoto: file });
      this.collateralForm.get('B_collateralPhoto')?.markAsTouched();
      const reader = new FileReader();
      reader.onload = () => this.backPhotoPreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  removeFrontPhoto(): void {
    this.frontPhotoPreview = null;
    this.collateralForm.patchValue({ F_collateralPhoto: null });
    this.collateralForm.get('F_collateralPhoto')?.markAsTouched();
    this.frontPhotoInput.nativeElement.value = '';
  }

  removeBackPhoto(): void {
    this.backPhotoPreview = null;
    this.collateralForm.patchValue({ B_collateralPhoto: null });
    this.collateralForm.get('B_collateralPhoto')?.markAsTouched();
    this.backPhotoInput.nativeElement.value = '';
  }

  // Other existing methods...
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
  }

  selectCollateralType(type: CollateralType): void {
    this.collateralTypeSearchInput = type.name;
    this.collateralForm.patchValue({ collateralTypeId: type.id });
    this.showCollateralTypeDropdown = false;
  }

  toggleCollateralTypeDropdown(): void {
    this.showCollateralTypeDropdown = !this.showCollateralTypeDropdown;
    if (this.showCollateralTypeDropdown && !this.collateralTypeSearchInput) {
      this.filteredCollateralTypes = this.collateralTypes.slice(0, 10);
    }
  }

  closeDropdowns(): void {
    setTimeout(() => {
      this.showCifDropdown = false;
      this.showCollateralTypeDropdown = false;
    }, 200);
  }
}
