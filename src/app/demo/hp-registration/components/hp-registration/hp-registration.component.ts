import { Component, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HpRegistration } from '../../models/hp-registration';
import { UserService } from 'src/app/demo/users/services/user.service';
import { CurrentAccountService } from 'src/app/demo/current-account/services/current-account.service';
import { HpProductService } from 'src/app/demo/hp-product/services/hp-product.service';

@Component({
  selector: 'app-hp-registration',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './hp-registration.component.html',
  styleUrls: ['./hp-registration.component.scss']
})
export class HpRegistrationComponent implements OnInit {
  hp: HpRegistration = {
    gracePeriod: 0,
    loanAmount: 0,
    downPayment: 0,
    loanTerm: 0,
    interestRate: '',
    lateFeeRate: 0,
    ninetyDayLateFeeRate: 0,
    one_hundred_and_eighty_late_fee_rate: 0,
    status: 1,
    currentAccountId: 0,
    hpProductId: 0
  };
  loading = signal(false);
  error = signal<string | null>(null);

  branchId: number | null = null;
  currentAccounts: any[] = [];
  hpProducts: any[] = [];

  constructor(private http: HttpClient, private userService: UserService, private accountService: CurrentAccountService,
    private productService: HpProductService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUserBranch();
    this.fetchCurrentAccountsByBranch();
    this.fetchHpProducts();
  }

  loadCurrentUserBranch(): void {
    this.userService.currentUser$.subscribe({
      next: (user) => {
        this.branchId = user?.branchId || null;
        this.fetchCurrentAccountsByBranch();
        this.fetchHpProducts();
      },
      error: (error) => {
        console.error('Failed to load user branch', error);
        this.fetchCurrentAccountsByBranch(); // Still load CIFs without branch filter
        this.fetchHpProducts(); // Still load CIFs without branch filter
      }
    });

    // If user data isn't loaded yet, trigger a refresh
    if (!this.userService.currentUserSubject.value) {
      this.userService.getCurrentUser().subscribe();
    }
  }


  fetchCurrentAccountsByBranch(branchId?: number): void {
    this.loading.set(true);
    this.error.set(null);
  
    this.accountService.getAllCurrentAccountByBranch(branchId).subscribe({
      next: (data) => {
        console.log('✅ Received accounts:', data); // Debugging
        this.currentAccounts = data;
        this.loading.set(false);
      },
      error: (err) => {
        console.error('❌ Error fetching accounts:', err);
        this.error.set('Failed to load accounts. Please try again.');
        this.loading.set(false);
      }
    });
  }

  onProductChange(event: Event): void {
    const productId = +(event.target as HTMLSelectElement).value;
    const selectedProduct = this.hpProducts.find(p => p.id === productId);
    
    if (selectedProduct) {
      this.hp.loanAmount = selectedProduct.price;
    } else {
      this.hp.loanAmount = 0;
    }
  }


  fetchHpProducts(branchId?: number): void {
    this.loading.set(true);
    this.error.set(null);
  
    this.productService.getAllActiveProducts(branchId).subscribe({
      next: (data) => {
        console.log('✅ Received accounts:', data); // Debugging
        this.hpProducts = data;
        this.loading.set(false);
      },
      error: (err) => {
        console.error('❌ Error fetching accounts:', err);
        this.error.set('Failed to load accounts. Please try again.');
        this.loading.set(false);
      }
    });
  }

 
  onSubmit() {
    console.log('Submitting HP Registration:', this.hp);
    
    this.http.post('http://localhost:8080/api/hp-registrations', {
      gracePeriod: this.hp.gracePeriod,
      loanAmount: this.hp.loanAmount,
      downPayment: this.hp.downPayment,
      loanTerm: this.hp.loanTerm,
      interestRate: this.hp.interestRate,
      late_fee_rate: this.hp.lateFeeRate,
      ninety_day_late_fee_rate: this.hp.ninetyDayLateFeeRate,
      one_hundred_and_eighty_late_fee_rate: this.hp.one_hundred_and_eighty_late_fee_rate,
      status: this.hp.status,
      currentAccount: { id: this.hp.currentAccountId }, // Send as object with id
      hpProductId: this.hp.hpProductId
    }).subscribe(
      response => {
        console.log('Saved successfully:', response);
        alert('HP Registration saved!');
      },
      error => {
        console.error('Error saving HP Registration:', error);
        alert('Error occurred while saving.');
      }
    );
  }
  
  
}
