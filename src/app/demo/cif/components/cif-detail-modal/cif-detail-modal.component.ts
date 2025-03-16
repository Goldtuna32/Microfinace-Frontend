import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImageModule } from 'primeng/image'; 
import { CIF } from '../../models/cif.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cif-detail-modal',
  imports: [ CommonModule, ImageModule],
  templateUrl: './cif-detail-modal.component.html',
  styleUrl: './cif-detail-modal.component.scss'
})
export class CifDetailModalComponent implements OnInit {
  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<CifDetailModalComponent>,
    @Inject(MAT_DIALOG_DATA) public cif: CIF
  ) {}

  ngOnInit(): void {
    console.log('CIF Data:', this.cif);  // This will log the CIF data to the console
  }


  closeDialog(): void {
    this.dialogRef.close();
  }

  downloadReport(format: string): void {
    const cifId = this.cif.id; // Assuming CIF model has an 'id' field
    if (!cifId) {
      console.error('CIF ID is missing');
      return;
    }

    const url = `http://localhost:8080/api/reports/cif/detail/${cifId}/${format}`;
    const fileName = `cif_detail_report_${cifId}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;

    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const link = document.createElement('a');
        const objectUrl = window.URL.createObjectURL(blob);
        link.href = objectUrl;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(objectUrl);
      },
      error: (error) => {
        console.error(`Error downloading ${format.toUpperCase()} report:`, error);
        // You might want to show an error message to the user here
      }
    });
  }
  

}
