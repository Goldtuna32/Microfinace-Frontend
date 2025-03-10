import { Component, ViewChild } from '@angular/core';
import { ProductType } from '../../models/product-type';
import { ProductTypeService } from '../../services/product-type.service';
import { CommonModule } from '@angular/common';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ProductTypeEditComponent } from '../product-type-edit/product-type-edit.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-type-list',
  standalone: true,
  imports: [CommonModule, SharedModule, ProductTypeEditComponent],
  templateUrl: './product-type-list.component.html',
  styleUrl: './product-type-list.component.scss'
})
export class ProductTypeListComponent {
  productTypes: ProductType[] = [];
  filteredProductTypes: ProductType[] = [];
  pageSize = 5;
  currentPage = 0;
  selectedProductType: ProductType | null = null;
  showEditModal = false;
  editedName: string = '';
  isInactiveView = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private productTypeService: ProductTypeService) {}

  ngOnInit(): void {
    this.loadProductTypes();
  }

  loadProductTypes(): void {
    this.productTypeService.getAllProductTypes().subscribe({
      next: (data) => {
        this.productTypes = data;
        this.updateFilteredProductTypes();
        if (this.paginator) {
          this.paginator.length = this.filteredProductTypes.length;
          this.paginator.pageIndex = this.currentPage;
          this.paginator.pageSize = this.pageSize;
        }
      },
      error: (error) => {
        console.error('Error loading product types', error);
      }
    });
  }

  updateFilteredProductTypes(filterValue: string = ''): void {
    this.filteredProductTypes = this.productTypes.filter(pt => {
      const matchesStatus = this.isInactiveView 
        ? pt.status === 0 || pt.status === 2 // Inactive
        : pt.status === 1; // Active
      const matchesFilter = pt.name?.toLowerCase().includes(filterValue.toLowerCase()) ?? true;
      return matchesStatus && matchesFilter;
    });
    if (this.paginator) {
      this.paginator.length = this.filteredProductTypes.length;
      this.paginator.firstPage();
    }
  }

  getPaginatedProductTypes(): ProductType[] {
    const startIndex = this.currentPage * this.pageSize;
    return this.filteredProductTypes.slice(startIndex, startIndex + this.pageSize);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filteredProductTypes = this.productTypes.filter(pt =>
      pt.name?.toLowerCase().includes(filterValue)
    );
    if (this.paginator) {
      this.paginator.length = this.filteredProductTypes.length;
      this.paginator.firstPage();
    }
  }

  getStatusDisplay(status?: number): string {
    if (status === undefined) return 'Unknown';
    return status === 1 ? 'Active' : 'Inactive';
  }
  
  getTotalPages(): number {
    return Math.ceil(this.filteredProductTypes.length / this.pageSize);
  }

  toggleView(): void {
    this.isInactiveView = !this.isInactiveView;
    this.updateFilteredProductTypes();
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.getTotalPages()) {
      this.currentPage = page;
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.getTotalPages() - 1) {
      this.currentPage++;
    }
  }

  openEditModal(productType: ProductType): void {
    this.selectedProductType = productType;
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedProductType = null;
  }

  saveProductType(updatedProductType: ProductType): void {
    this.productTypeService.updateProductType(updatedProductType).subscribe({
      next: (response) => {
        const index = this.productTypes.findIndex(pt => pt.id === updatedProductType.id);
        if (index !== -1) {
          this.productTypes[index] = response;
          this.updateFilteredProductTypes(); // Re-filter after update
        }
        this.closeEditModal();
      },
      error: (error) => {
        console.error('Error updating product type', error);
      }
    });
  }

  deleteProductType(id: number): void {
    if (confirm('Are you sure you want to delete this product type?')) {
      this.productTypeService.deleteProductType(id).subscribe({
        next: () => {
          this.productTypes = this.productTypes.map(pt => 
            pt.id === id ? { ...pt, status: 0 } : pt
          );
          this.updateFilteredProductTypes(); // Re-filter after delete
          if (this.paginator) {
            this.paginator.length = this.filteredProductTypes.length;
          }
        },
        error: (error) => {
          console.error('Error deleting product type', error);
          alert('Failed to delete product type');
        }
      });
    }
  }

  // product-type-list.component.ts (relevant method only)
restoreProductType(id: number): void {
  if (confirm('Are you sure you want to restore this product type?')) {
    this.productTypeService.restoreProductType(id).subscribe({
      next: (response) => {
        const index = this.productTypes.findIndex(pt => pt.id === id);
        if (index !== -1) {
          this.productTypes[index] = response; // Update with the full response
          this.updateFilteredProductTypes();
        }
      },
      error: (error) => {
        console.error('Error restoring product type', error);
        alert('Failed to restore product type');
      }
    });
  }
}
}