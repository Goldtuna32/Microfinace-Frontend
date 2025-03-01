import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Collateral } from '../../models/collateral.model';
import { CommonModule } from '@angular/common';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-collateral-detail',
  imports: [ CommonModule, ImageModule],
  templateUrl: './collateral-detail.component.html',
  styleUrl: './collateral-detail.component.scss'
})
export class CollateralDetailComponent {
  constructor(
    public dialogRef: MatDialogRef<CollateralDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public collateral: Collateral
  ) {
    // Debug photo URLs
    console.log('Collateral Data:', this.collateral);
    console.log('Front Photo URL:', this.collateral.f_collateral_photo);
    console.log('Back Photo URL:', this.collateral.b_collateral_photo);
  }

  close(): void {
    this.dialogRef.close();
  }

}
