import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Branch } from '../../models/branch.model';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchService } from '../../services/branch.service';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-branch-detail',
  imports: [ CommonModule, ReactiveFormsModule, FormsModule,MatTableModule,
    MatCardModule,
    MatButtonModule],
  templateUrl: './branch-detail.component.html',
  styleUrl: './branch-detail.component.scss'
})
export class BranchDetailComponent{
  branch: any = null;
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private branchService: BranchService
  ) {}

  ngOnInit(): void {
    const branchId = this.route.snapshot.paramMap.get('id');
    if (branchId) {
      this.loadBranchDetails(+branchId);
    }
  }

  loadBranchDetails(branchId: number): void {
    this.loading = true;
    this.branchService.getBranchDetails(branchId).subscribe({
      next: (data) => {
        this.branch = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load branch details.';
        this.loading = false;
        console.error(error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/branches']);
  }
}
