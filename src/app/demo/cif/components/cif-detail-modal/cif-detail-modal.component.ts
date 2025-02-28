import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImageModule } from 'primeng/image'; 
import { CIF } from '../../models/cif.model';

@Component({
  selector: 'app-cif-detail-modal',
  imports: [ CommonModule, ImageModule],
  templateUrl: './cif-detail-modal.component.html',
  styleUrl: './cif-detail-modal.component.scss'
})
export class CifDetailModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<CifDetailModalComponent>,
    @Inject(MAT_DIALOG_DATA) public cif: CIF
  ) {}

  ngOnInit(): void {
    console.log('CIF Data:', this.cif);  // This will log the CIF data to the console
  }


  closeDialog(): void {
    this.dialogRef.close();
  }
  

}
