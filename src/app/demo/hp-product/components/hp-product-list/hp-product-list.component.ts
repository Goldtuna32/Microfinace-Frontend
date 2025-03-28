import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { HpProduct } from '../../models/hp-product';
import { HpProductService } from '../../services/hp-product.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-hp-product-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './hp-product-list.component.html',
  styleUrl: './hp-product-list.component.scss'
})
export class HpProductListComponent {
  hpProducts: HpProduct[] = [];
  filteredHpProducts: HpProduct[] = [];
  pageSize = 5;
  currentPage = 0;
  isInactiveView = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private hpProductService: HpProductService) {}

  ngOnInit(): void {
    this.loadHpProducts();
  }

  loadHpProducts(): void {
    this.hpProductService.getAllHpProducts().subscribe({
      next: (data) => {
        this.hpProducts = data;
        this.updateFilteredHpProducts();
        if (this.paginator) {
          this.paginator.length = this.filteredHpProducts.length;
          this.paginator.pageIndex = this.currentPage;
          this.paginator.pageSize = this.pageSize;
        }
      },
      error: (error) => console.error('Error loading HP products', error)
    });
  }

  updateFilteredHpProducts(filterValue: string = ''): void {
    this.filteredHpProducts = this.hpProducts.filter(pt => {
      const matchesStatus = this.isInactiveView 
        ? pt.status === 0 || pt.status === 2
        : pt.status === 1;
      const matchesFilter = pt.name?.toLowerCase().includes(filterValue.toLowerCase()) ?? true;
      return matchesStatus && matchesFilter;
    });
    if (this.paginator) {
      this.paginator.length = this.filteredHpProducts.length;
      this.paginator.firstPage();
    }
  }

  getPaginatedHpProducts(): HpProduct[] {
    const startIndex = this.currentPage * this.pageSize;
    return this.filteredHpProducts.slice(startIndex, startIndex + this.pageSize);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    this.updateFilteredHpProducts(filterValue);
  }

  getStatusDisplay(status?: number): string {
    if (status === undefined) return 'Unknown';
    return status === 1 ? 'Active' : 'Inactive';
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredHpProducts.length / this.pageSize);
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

  toggleView(): void {
    this.isInactiveView = !this.isInactiveView;
    this.updateFilteredHpProducts();
  }

  deleteHpProduct(id: number): void {
    if (confirm('Are you sure you want to delete this HP product?')) {
      this.hpProductService.deleteHpProduct(id).subscribe({
        next: () => {
          this.hpProducts = this.hpProducts.map(pt => 
            pt.id === id ? { ...pt, status: 0 } : pt
          );
          this.updateFilteredHpProducts();
          if (this.paginator) {
            this.paginator.length = this.filteredHpProducts.length;
          }
        },
        error: (error) => {
          console.error('Error deleting HP product', error);
          alert('Failed to delete HP product');
        }
      });
    }
  }

  restoreHpProduct(id: number): void {
    if (confirm('Are you sure you want to restore this HP product?')) {
      this.hpProductService.restoreHpProduct(id).subscribe({
        next: (response) => {
          const index = this.hpProducts.findIndex(pt => pt.id === id);
          if (index !== -1) {
            this.hpProducts[index] = response;
            this.updateFilteredHpProducts();
          }
        },
        error: (error) => {
          console.error('Error restoring HP product', error);
          alert('Failed to restore HP product');
        }
      });
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/48?text=No+Image'; // Fallback image
  }
}
