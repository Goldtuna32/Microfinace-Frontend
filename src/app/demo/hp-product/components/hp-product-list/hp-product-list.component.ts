import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { HpProduct } from '../../models/hp-product';
import { HpProductService } from '../../services/hp-product.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from 'src/app/demo/users/services/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from 'src/app/alertservice/alert.service';

@Component({
  selector: 'app-hp-product-list',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './hp-product-list.component.html',
  styleUrl: './hp-product-list.component.scss'
})
export class HpProductListComponent {
  hpProducts: HpProduct[] = [];
  filteredHpProducts: HpProduct[] = [];
  dataSource = new MatTableDataSource<HpProduct>([]);
  pageSize = 5;
  currentPage = 0;
  isInactiveView = false;
  loading = true;
  errorMessage = '';
  branchId: number | null = null;
  totalItems = 0;
  hoveredRow: number | null = null;
  showSuccessAlert = false;
  searchTerm = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private hpProductService: HpProductService, 
    private router: Router, 
    private userService: UserService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUserBranch();
  
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['success']) {
      this.showSuccessAlert = true;
      setTimeout(() => {
        this.showSuccessAlert = false;
      }, 5000);
    }
  }

  loadCurrentUserBranch(): void {
    this.userService.currentUser$.subscribe({
      next: (user) => {
        this.branchId = user?.branchId || null;
        this.loadHpProducts();
      },
      error: (error) => {
        console.error('Failed to load user branch', error);
        this.loadHpProducts();
      }
    });

    if (!this.userService.currentUserSubject.value) {
      this.userService.getCurrentUser().subscribe();
    }
  }

  loadHpProducts(): void {
    this.loading = true;
    this.errorMessage = '';
  
    const productObservable = this.isInactiveView
      ? this.hpProductService.getAllInactiveProducts(this.branchId ?? undefined)
      : this.hpProductService.getAllActiveProducts(this.branchId ?? undefined);
  
    productObservable.subscribe({
      next: (products: HpProduct[]) => {
        console.log('Loaded products:', products);
        this.hpProducts = products;
        this.filteredHpProducts = [...products]; // Initialize filtered list
        this.totalItems = products.length;
        this.loading = false;
        this.updateFilteredProducts();
      },
      error: (error) => {
        this.alertService.showError("Failed to load HP Products");
        this.loading = false;
        this.errorMessage = 'Failed to load product list.';
        this.hpProducts = [];
        this.filteredHpProducts = [];
        this.totalItems = 0;
      }
    });
  }

  updateFilteredProducts(): void {
    this.filteredHpProducts = this.hpProducts.filter(product => {
      const matchesSearch = this.searchTerm 
        ? product.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? true
        : true;
      return matchesSearch;
    });
    this.totalItems = this.filteredHpProducts.length;
    this.currentPage = 0; // Reset to first page when filtering
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
    this.searchTerm = (event.target as HTMLInputElement).value.trim();
    this.updateFilteredProducts();
  }

  getStatusDisplay(status: number): string {
    return status === 1 ? 'Active' : 'Inactive';
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredHpProducts.length / this.pageSize);
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.getTotalPages() }, (_, i) => i + 1);
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
    this.loadHpProducts(); // Reload products when view changes
  }

  deleteHpProduct(id: number): void {
    if (confirm('Are you sure you want to delete this HP product?')) {
      this.hpProductService.deleteHpProduct(id).subscribe({
        next: () => {
          this.loadHpProducts(); // Refresh the list after deletion
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
        next: () => {
          this.loadHpProducts(); // Refresh the list after restoration
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
    img.src = 'https://via.placeholder.com/100?text=No+Image';
  }
}
