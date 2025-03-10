import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductType } from '../../models/product-type';
import { ProductTypeService } from '../../services/product-type.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-type-edit',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-type-edit.component.html',
  styleUrl: './product-type-edit.component.scss'
})
export class ProductTypeEditComponent {
  @Input() productType: ProductType | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<ProductType>();

  editedProductType: ProductType = { id: 0, name: '' }; // Removed status from initial object

  constructor(private productTypeService: ProductTypeService) {}

  ngOnChanges(): void {
    if (this.productType) {
      this.editedProductType = { ...this.productType }; // Copy only what's needed
    }
  }

  onSave(): void {
    this.save.emit(this.editedProductType);
  }

  onClose(): void {
    this.close.emit();
  }
}
