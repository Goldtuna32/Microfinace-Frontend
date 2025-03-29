import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DealerRegistrationService } from '../../services/dealer-registration.service';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { DealerRegistration } from 'src/app/demo/hp-product/services/hp-product.service';
import { AlertService } from 'src/app/alertservice/alert.service';
import { UserService } from 'src/app/demo/users/services/user.service';

@Component({
  selector: 'app-dealer-registration-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule,RouterModule],
  templateUrl: './dealer-registration-list.component.html',
})
export class DealerRegistrationListComponent implements OnInit {
  dealers: any[] = [];
  filteredDealers: any[] = [];
  searchText: string = '';
  dataSource = new MatTableDataSource<DealerRegistration>([]);
  loading = true;
  errorMessage = '';
  isDeletedView = false;
  branchId: number | null = null;
  totalItems = 0;
  showSuccessAlert: boolean = false;


  currentPage = 1;
  pageSize = 10;
  totalPages = 0;

  constructor(private dealerService: DealerRegistrationService, private router: Router, private userService: UserService,
    private alertService: AlertService) {}

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
          this.loadDealers();
        },
        error: (error) => {
          console.error('Failed to load user branch', error);
          this.loadDealers(); // Still load CIFs without branch filter
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
      this.loadDealers();
    }

    loadDealers(showActive: boolean = true, branchId?: number): void {
      this.loading = true;
      this.errorMessage = '';
  
      const dealerObservable = showActive 
          ? this.dealerService.getAllActiveDealers(branchId)
          : this.dealerService.getAllInactiveDealers(branchId);
  
      dealerObservable.subscribe({
          next: (data) => {
              this.dealers = data;
              this.filteredDealers = data; // Initialize with all loaded dealers
              this.loading = false;
          },
          error: (error) => {
              this.errorMessage = 'Failed to load dealers. Please try again.';
              this.loading = false;
              console.error('Error loading dealers:', error);
          }
      });
  }

  filterDealers(): void {
    if (!this.searchText) {
      this.filteredDealers = this.dealers;
    } else {
      this.filteredDealers = this.dealers.filter((dealer) =>
        dealer.companyName.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }

  deleteDealer(id: number): void {
    if (confirm('Are you sure you want to delete this dealer?')) {
      this.dealerService.deleteDealer(id).subscribe(() => {
        this.loadDealers();
      });
    }
  }

  filterByStatus(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const status = select.value ? Number(select.value) : null;
    // Implement your status filtering logic here
    this.filterDealers();
  }
  
  getPageNumbers(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
  
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      // Implement your pagination logic
    }
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      // Implement your pagination logic
    }
  }
  
  goToPage(page: number): void {
    this.currentPage = page;
    // Implement your pagination logic
  }
  
 
}
