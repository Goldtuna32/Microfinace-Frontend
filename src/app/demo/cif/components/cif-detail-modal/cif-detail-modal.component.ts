import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImageModule } from 'primeng/image'; 
import { CIF } from '../../models/cif.model';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CifService } from '../../services/cif.service';

@Component({
  selector: 'app-cif-detail-modal',
  imports: [ CommonModule, ImageModule],
  templateUrl: './cif-detail-modal.component.html',
  styleUrl: './cif-detail-modal.component.scss'
})
export class CifDetailModalComponent implements OnInit {
  cif!: CIF; // CIF data
  isLoading: boolean = true; // Loading state

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private http: HttpClient,
    private cifService: CifService // Service to fetch CIF data
  ) {}

  ngOnInit(): void {
    const cifId = this.route.snapshot.paramMap.get('id');
    if (cifId) {
      const numericCifId = Number(cifId); // Convert string to number
      this.cifService.getCIFById(numericCifId).subscribe(data => {
        this.cif = data;
        this.isLoading = false; // Set loading to false when data is loaded
      }, error => {
        console.error('Error fetching CIF data:', error);
        this.isLoading = false; // Set loading to false even on error
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/cif/list']); // Adjust the route to your CIF list page
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
