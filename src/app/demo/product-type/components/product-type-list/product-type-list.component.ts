import { Component, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ProductType } from '../../models/product-type';
import { ProductTypeService } from '../../services/product-type.service';
import { CommonModule } from '@angular/common';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ProductTypeEditComponent } from '../product-type-edit/product-type-edit.component';
import { RouterLink } from '@angular/router';
import { Subject,finalize, takeUntil } from 'rxjs';


@Component({
  selector: 'app-product-type-list',
  standalone: true,
  imports: [CommonModule, SharedModule, ProductTypeEditComponent],
  templateUrl: './product-type-list.component.html',
  styleUrl: './product-type-list.component.scss',
  animations: [
    trigger('rowAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class ProductTypeListComponent {
  private destroy$ = new Subject<void>();

  productTypes: ProductType[] = [];
  filteredProductTypes: ProductType[] = [];
  pageSize = 10;
  currentPage = 0;
  selectedProductType: ProductType | null = null;
  showEditModal = false;
  isInactiveView = false;
  searchTerm = '';
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private productTypeService: ProductTypeService) {}

  ngOnInit(): void {
    this.loadProductTypes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProductTypes(): void {
    this.isLoading = true;
    
    this.productTypeService.getAllProductTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.productTypes = data;
          this.updateFilteredProductTypes();
          this.updatePaginator();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading product types', error);
          alert('Failed to load product types');
          this.isLoading = false;
        }
      });
  }

  updateFilteredProductTypes(): void {
    this.filteredProductTypes = this.productTypes.filter(pt => {
      const matchesStatus = this.isInactiveView 
        ? pt.status === 0 || pt.status === 2
        : pt.status === 1;
      const matchesFilter = this.searchTerm 
        ? pt.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? true
        : true;
      return matchesStatus && matchesFilter;
    });
    
    // Reset to first page when filtering
    this.currentPage = 0;
    this.updatePaginator();
  }

  updatePaginator(): void {
    if (this.paginator) {
      this.paginator.length = this.filteredProductTypes.length;
      this.paginator.pageIndex = this.currentPage;
      this.paginator.pageSize = this.pageSize;
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
    this.searchTerm = (event.target as HTMLInputElement).value.trim();
    this.updateFilteredProductTypes();
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
    this.selectedProductType = { ...productType };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedProductType = null;
  }

  saveProductType(updatedProductType: ProductType): void {
    this.isLoading = true;
    
    this.productTypeService.updateProductType(updatedProductType)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const index = this.productTypes.findIndex(pt => pt.id === updatedProductType.id);
          if (index !== -1) {
            this.productTypes[index] = response;
            this.updateFilteredProductTypes();
          }
          alert('Product type updated successfully');
          this.closeEditModal();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error updating product type', error);
          alert('Failed to update product type');
          this.isLoading = false;
        }
      });
  }

  deleteProductType(id: number): void {
    if (confirm('Are you sure you want to delete this product type?')) {
      this.isLoading = true;
      
      this.productTypeService.deleteProductType(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.productTypes = this.productTypes.map(pt => 
              pt.id === id ? { ...pt, status: 0 } : pt
            );
            this.updateFilteredProductTypes();
            alert('Product type deleted successfully');
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error deleting product type', error);
            alert('Failed to delete product type');
            this.isLoading = false;
          }
        });
    }
  }

  restoreProductType(id: number): void {
    if (confirm('Are you sure you want to restore this product type?')) {
      this.isLoading = true;
      
      this.productTypeService.restoreProductType(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            const index = this.productTypes.findIndex(pt => pt.id === id);
            if (index !== -1) {
              this.productTypes[index] = response;
              this.updateFilteredProductTypes();
            }
            alert('Product type restored successfully');
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error restoring product type', error);
            alert('Failed to restore product type');
            this.isLoading = false;
          }
        });
    }
  }

  trackById(index: number, productType: ProductType): number {
    return productType.id;
  }
}