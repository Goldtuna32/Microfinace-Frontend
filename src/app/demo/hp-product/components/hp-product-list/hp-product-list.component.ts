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
  isDeletedView = false;
  branchId: number | null = null;
  totalItems = 0;
  hoveredRow: number | null = null; // Track hover state by ID instead of adding property to model
  showSuccessAlert: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private hpProductService: HpProductService, private router: Router, private userService: UserService,
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
        this.loadHpProducts(); // Still load CIFs without branch filter
      }
    });

    // If user data isn't loaded yet, trigger a refresh
    if (!this.userService.currentUserSubject.value) {
      this.userService.getCurrentUser().subscribe();
    }
  }

  loadBranchId(): void {
    // Get branch ID from service or localStorage
    const storedBranch = localStorage.getItem('currentBranch');
    this.branchId = storedBranch ? JSON.parse(storedBranch).id : null;
    this.loadHpProducts();
  }

   
  loadHpProducts(): void {
    this.loading = true;
    this.errorMessage = '';
  
    const cifObservable = this.isDeletedView
      ? this.hpProductService.getAllActiveProducts(this.branchId ?? undefined)
      : this.hpProductService.getAllInactiveProducts(this.branchId ?? undefined);
  
    cifObservable.subscribe({
      next: (hps: HpProduct[]) => {
        this.hpProducts = hps;
        this.filteredHpProducts = hps;
        this.dataSource.data = hps;
        this.totalItems = hps.length;
         this.loading = false;
      },
      error: (error) => {
        this.alertService.showError("Failed to load CIF List");
        this.loading = false;
        this.errorMessage = 'Failed to load CIF list.';
        this.dataSource.data = [];
        this.totalItems = 0;
      }
    });
  }

  updateFilteredHpProducts(filterValue: string = ''): void {
    this.filteredHpProducts = this.hpProducts.filter(product => {
      const matchesStatus = this.isInactiveView 
        ? product.status === 0 || product.status === 2
        : product.status === 1;
      const matchesFilter = product.name?.toLowerCase().includes(filterValue.toLowerCase()) ?? true;
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
          this.hpProducts = this.hpProducts.map(product => 
            product.id === id ? { ...product, status: 0 } : product
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
          const index = this.hpProducts.findIndex(product => product.id === id);
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
    img.src = 'https://via.placeholder.com/100?text=No+Image';
  }
}
