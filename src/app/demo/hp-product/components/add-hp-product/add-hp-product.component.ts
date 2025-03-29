import { Component } from '@angular/core';
import { DealerRegistration, HpProductService, ProductType } from '../../services/hp-product.service';
import { HpProductCreate } from '../../models/hp-product';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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

  productTypes: ProductType[] = [];
  dealerRegistrations: DealerRegistration[] = [];

  constructor(
    private hpProductService: HpProductService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadProductTypes();
    this.loadDealerRegistrations();
  }

  loadProductTypes() {
    this.hpProductService.getProductTypes().subscribe({
      next: (types) => {
        this.productTypes = types;
        if (types.length > 0) this.hpProduct.productTypeId = types[0].id;
      },
      error: (error) => console.error('Error loading product types:', error)
    });
  }

  loadDealerRegistrations() {
    this.hpProductService.getDealerRegistrations().subscribe({
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
