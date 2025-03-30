import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HpRegistration } from '../../models/hp-registration';
import { HpRegistrationService } from '../../services/hp-registration.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CurrentAccount } from 'src/app/demo/current-account/components/current-account-list/current-account-list.component';
import { CurrentAccountService } from 'src/app/demo/current-account/services/current-account.service';
import { HpProduct } from 'src/app/demo/hp-product/models/hp-product';
import { HpProductService } from 'src/app/demo/hp-product/services/hp-product.service';

@Component({
  selector: 'app-hp-registration-detail',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './hp-registration-detail.component.html',
  styleUrl: './hp-registration-detail.component.scss'
})
export class HpRegistrationDetailComponent {
  hpRegistration: HpRegistration | null = null;
  hpProduct: HpProduct | null = null;
  loading = true;
  error: string | null = null;
  cardStates: {[key: string]: 'normal'|'hovered'} = {
    basic: 'normal',
    financial: 'normal',
    fees: 'normal',
    account: 'normal',
    product: 'normal'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hpRegistrationService: HpRegistrationService,
    private hpProductService: HpProductService
  ) {}

  ngOnInit(): void {
    this.loadHpRegistration();
  }

  loadHpRegistration(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Invalid HP registration ID';
      this.loading = false;
      return;
    }

    this.hpRegistrationService.getById(+id).subscribe({
      next: (data) => {
        this.hpRegistration = data;
        this.loadHpProduct();
      },
      error: (err) => {
        this.error = 'Failed to load HP registration details';
        this.loading = false;
        console.error(err);
      }
    });
  }

  loadHpProduct(): void {
    if (!this.hpRegistration?.hpProductId) {
      this.loading = false;
      return;
    }

    this.hpProductService.getHpProductById(this.hpRegistration.hpProductId).subscribe({
      next: (product) => {
        this.hpProduct = product;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load HP product', err);
        this.loading = false;
      }
    });
  }

  getStatusClass(status: number): string {
    switch(status) {
      case 4: return 'badge bg-success bg-opacity-10 text-success';
      case 3: return 'badge bg-warning bg-opacity-10 text-warning';
      case 2: return 'badge bg-danger bg-opacity-10 text-danger';
      default: return 'badge bg-secondary bg-opacity-10 text-secondary';
    }
  }

  getStatusText(status: number): string {
    switch(status) {
      case 4: return 'Approved';
      case 3: return 'Pending';
      case 2: return 'Rejected';
      default: return 'Unknown';
    }
  }

  goBack(): void {
    this.router.navigate(['/hp-registrations']);
  }

  editRegistration(): void {
    if (this.hpRegistration?.id) {
      this.router.navigate(['/hp-registrations', this.hpRegistration.id, 'edit']);
    }
  }

  onCardHover(card: string, isHovered: boolean): void {
    this.cardStates[card] = isHovered ? 'hovered' : 'normal';
  }

  getProductStatusClass(status: number): string {
    switch(status) {
      case 1: return 'badge bg-success bg-opacity-10 text-success';
      case 2: return 'badge bg-warning bg-opacity-10 text-warning';
      case 3: return 'badge bg-danger bg-opacity-10 text-danger';
      default: return 'badge bg-secondary bg-opacity-10 text-secondary';
    }
  }

  getProductStatusText(status: number): string {
    switch(status) {
      case 1: return 'Active';
      case 2: return 'Inactive';
      case 3: return 'Discontinued';
      default: return 'Unknown';
    }
  }
}
