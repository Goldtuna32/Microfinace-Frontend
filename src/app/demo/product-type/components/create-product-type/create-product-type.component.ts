import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductType } from '../../models/product-type';
import { ProductTypeService } from '../../services/product-type.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-product-type',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './create-product-type.component.html',
  styleUrl: './create-product-type.component.scss'
})
export class CreateProductTypeComponent {
  productType: Omit<ProductType, 'id'> = { name: '', status: 1 };

  constructor(
    private productTypeService: ProductTypeService,
    private router: Router
  ) {}

  saveProductType(): void {
    this.productTypeService.createProductType(this.productType).subscribe({
      next: (response: ProductType) => {
        console.log('Product type created:', response);
        this.router.navigate(['/product-types']);
      },
      error: (error) => {
        console.error('Error creating product type:', error);
        alert('Failed to create product type');
      }
    });
  }
}
