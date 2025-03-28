import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DealerRegistrationService } from '../../services/dealer-registration.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

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

  currentPage = 1;
  pageSize = 10;
  totalPages = 0;

  constructor(private dealerService: DealerRegistrationService) {}

  ngOnInit(): void {
    this.loadDealers();
  }

  loadDealers(): void {
    this.dealerService.getAllDealers().subscribe((data) => {
      this.dealers = data;
      this.filteredDealers = data; // Initialize with all dealers
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
