import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HpProductCreate } from '../../models/hp-product';
import { ProductType, DealerRegistration, HpProductService } from '../../services/hp-product.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-hp-product-edit',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './hp-product-edit.component.html',
  styleUrl: './hp-product-edit.component.scss'
})
export class HpProductEditComponent implements OnInit {
  hpProduct: HpProductCreate = {
    name: '',
    price: 0,
    productTypeId: 0,
    dealerRegistrationId: 0,
    commissionFee: 0
  };
  photoFile: File | null = null;
  productId: number = 0;
  previewUrl: SafeUrl | null = null;
  selectedFile: boolean = false;
  currentPhotoUrl: string = ''; // To display the existing photo
  productTypes: ProductType[] = [];
  dealerRegistrations: DealerRegistration[] = [];

  constructor(
    private hpProductService: HpProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProductData();
    this.loadProductTypes();
    this.loadDealerRegistrations();
  }

  loadProductData(): void {
    this.hpProductService.getHpProductById(this.productId).subscribe({
      next: (product) => {
        this.hpProduct = {
          name: product.name,
          price: product.price,
          productTypeId: product.productTypeId,
          dealerRegistrationId: product.dealerRegistrationId,
          commissionFee: product.commissionFee
        };
        this.currentPhotoUrl = product.hpProductPhoto; // Store current photo URL
      },
      error: (error) => {
        console.error('Error loading product:', error);
        alert('Failed to load product data');
      }
    });
  }

  loadProductTypes(): void {
    this.hpProductService.getProductTypes().subscribe({
      next: (types) => this.productTypes = types,
      error: (error) => console.error('Error loading product types:', error)
    });
  }

  loadDealerRegistrations(): void {
    this.hpProductService.getDealerRegistrations().subscribe({
      next: (registrations) => this.dealerRegistrations = registrations,
      error: (error) => console.error('Error loading dealer registrations:', error)
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.photoFile = input.files[0];
      this.currentPhotoUrl = URL.createObjectURL(this.photoFile); // Preview new photo
    }
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

  onSubmit(): void {
    this.hpProductService.updateHpProduct(this.productId, this.hpProduct, this.photoFile).subscribe({
      next: (response) => {
        console.log('Product updated successfully:', response);
        this.router.navigate(['/hp-products']); // Redirect to product list
      },
      error: (error) => {
        console.error('Error updating product:', error);
        alert('Failed to update product');
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/hp-products']); // Redirect back to list
  }
}
