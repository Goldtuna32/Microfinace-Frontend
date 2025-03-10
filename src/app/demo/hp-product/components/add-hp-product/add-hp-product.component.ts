import { Component } from '@angular/core';
import { DealerRegistration, HpProductService, ProductType } from '../../services/hp-product.service';
import { HpProductCreate } from '../../models/hp-product';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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

  productTypes: ProductType[] = [];
  dealerRegistrations: DealerRegistration[] = [];

  constructor(private hpProductService: HpProductService) {}

  ngOnInit() {
    this.loadProductTypes();
    this.loadDealerRegistrations();
  }

  loadProductTypes() {
    this.hpProductService.getProductTypes().subscribe({
      next: (types) => {
        this.productTypes = types;
        if (types.length > 0) this.hpProduct.productTypeId = types[0].id; // Default to first option
      },
      error: (error) => console.error('Error loading product types:', error)
    });
  }

  loadDealerRegistrations() {
    this.hpProductService.getDealerRegistrations().subscribe({
      next: (registrations) => {
        this.dealerRegistrations = registrations;
        if (registrations.length > 0) this.hpProduct.dealerRegistrationId = registrations[0].id; // Default to first option
      },
      error: (error) => console.error('Error loading dealer registrations:', error)
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.photoFile = input.files[0];
    }
  }

  onSubmit() {
    if (this.photoFile) {
      this.hpProductService.createHpProduct(this.hpProduct, this.photoFile).subscribe({
        next: (response) => {
          console.log('Product created successfully:', response);
          this.hpProduct = { name: '', price: 0, productTypeId: 0, dealerRegistrationId: 0, commissionFee: 0 };
          this.photoFile = null;
        },
        error: (error) => console.error('Error creating product:', error)
      });
    } else {
      alert('Please upload a photo');
    }
  }
}
