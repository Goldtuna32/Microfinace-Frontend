import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollateralService } from '../../services/collateral.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-collateral-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './collateral-list.component.html',
  styleUrl: './collateral-list.component.scss'
})
export class CollateralListComponent implements OnInit {
  collaterals: any[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private collateralService: CollateralService) {}

  ngOnInit(): void {
    this.loadCollaterals();
  }

  private loadCollaterals(): void {
    this.loading = true;
    this.collateralService.getAllCollaterals().subscribe({
      next: (data) => {
        this.collaterals = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading collaterals. Please try again later.';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }
}
