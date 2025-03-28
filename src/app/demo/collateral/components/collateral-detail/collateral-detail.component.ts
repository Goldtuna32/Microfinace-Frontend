import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Collateral } from '../../models/collateral.model';
import { CommonModule } from '@angular/common';
import { ImageModule } from 'primeng/image';
import { ActivatedRoute } from '@angular/router';
import { CollateralService } from '../../services/collateral.service';

@Component({
  selector: 'app-collateral-detail',
  imports: [ CommonModule, ImageModule],
  templateUrl: './collateral-detail.component.html',
  styleUrl: './collateral-detail.component.scss'
})
export class CollateralDetailComponent {
  collateral: Collateral | undefined;

  constructor(
    private route: ActivatedRoute,
    private collateralService: CollateralService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCollateral(id);
    }
  }

  loadCollateral(id: string): void {
    this.collateralService.getCollateralById(id).subscribe(
      (data) => {
        this.collateral = data;
        console.log('Collateral Data:', this.collateral);
        console.log('Front Photo URL:', this.collateral.f_collateral_photo);
        console.log('Back Photo URL:', this.collateral.b_collateral_photo);
      },
      (error) => {
        console.error('Error loading collateral:', error);
      }
    );
  }

  goBack(): void {
    window.history.back();
  }
}
