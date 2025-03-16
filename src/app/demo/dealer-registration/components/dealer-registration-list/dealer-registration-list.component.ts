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

  
 
}
