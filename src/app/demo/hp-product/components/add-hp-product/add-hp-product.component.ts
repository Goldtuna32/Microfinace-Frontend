import { Component } from '@angular/core';
import { DealerRegistration, HpProductService, ProductType } from '../../services/hp-product.service';
import { HpProductCreate } from '../../models/hp-product';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UserService } from 'src/app/demo/users/services/user.service';
import { DealerRegistrationService } from 'src/app/demo/dealer-registration/services/dealer-registration.service';
import { ProductTypeService } from 'src/app/demo/product-type/services/product-type.service';

@Component({
  selector: 'app-add-hp-product',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-hp-product.component.html',
  styleUrl: './add-hp-product.component.scss'
})
export class AddHpProductComponent {
  hpProduct: HpProductCreate = {
    name: '',
    price: 0,
    productTypeId: 0,
    dealerRegistrationId: 0,
    commissionFee: 0
  };
  photoFile: File | null = null;
  previewUrl: SafeUrl | null = null;
  selectedFile: boolean = false;
  showSuccessAlert = false;
  branchId: number | null = null;

  productTypes: ProductType[] = [];
  dealerRegistrations: DealerRegistration[] = [];

  constructor(
    private hpProductService: HpProductService,
    private dealerService: DealerRegistrationService,
    private router: Router,
    private userService: UserService,
    private sanitizer: DomSanitizer,
    private productTypeSer: ProductTypeService
  ) {}

  ngOnInit() {
    this.loadCurrentUserBranch();
  
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['success']) {
      this.showSuccessAlert = true;
      setTimeout(() => {
        this.showSuccessAlert = false;
      }, 5000);
    }
    this.loadProductTypes();
    this.loadDealerRegistrations();
  }

  loadCurrentUserBranch(): void {
    this.userService.currentUser$.subscribe({
      next: (user) => {
        this.branchId = user?.branchId || null;
        this.loadProductTypes();
        this.loadDealerRegistrations
      },
      error: (error) => {
        console.error('Failed to load user branch', error);
        this.loadProductTypes();
        this.loadDealerRegistrations
      }
    });

    if (!this.userService.currentUserSubject.value) {
      this.userService.getCurrentUser().subscribe();
    }
  }

  loadProductTypes() {
    this.productTypeSer.getAllProductTypes().subscribe({
      next: (types) => {
        // Ensure all product types have required properties before assignment
        this.productTypes = types.map(type => ({
          id: type.id,
          name: type.name || ''
        }));
        if (this.productTypes.length > 0) {
          this.hpProduct.productTypeId = this.productTypes[0].id;
        }
      },
      error: (error) => console.error('Error loading product types:', error)
    });
  }

  loadDealerRegistrations() {
    this.dealerService.getAllActiveDealers().subscribe({
      next: (registrations) => {
        this.dealerRegistrations = registrations;
        if (registrations.length > 0) this.hpProduct.dealerRegistrationId = registrations[0].id;
      },
      error: (error) => console.error('Error loading dealer registrations:', error)
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.photoFile = input.files[0];
      this.selectedFile = true;
      this.generatePreview(this.photoFile);
    }
  }

  generatePreview(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      this.previewUrl = this.sanitizer.bypassSecurityTrustUrl(event.target?.result as string);
    };
  }

  clearFile() {
    this.photoFile = null;
    this.previewUrl = null;
    this.selectedFile = false;
    // Reset the file input
    const fileInput = document.getElementById('photo') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  resetForm() {
    this.hpProduct = { 
      name: '', 
      price: 0, 
      productTypeId: this.productTypes.length > 0 ? this.productTypes[0].id : 0,
      dealerRegistrationId: this.dealerRegistrations.length > 0 ? this.dealerRegistrations[0].id : 0,
      commissionFee: 0 
    };
    this.clearFile();
  }

  onSubmit() {
    if (this.photoFile) {
      this.hpProductService.createHpProduct(this.hpProduct, this.photoFile).subscribe({
        next: (response) => {
          console.log('Product created successfully:', response);
          alert('Product created successfully!');
          this.resetForm();
        },
        error: (error) => {
          console.error('Error creating product:', error);
          alert('Error creating product. Please try again.');
        }
      });
    } else {
      alert('Please upload a product photo');
    }
  }
}
