import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Branch } from '../../models/branch.model';
import { ActivatedRoute } from '@angular/router';
import { BranchService } from '../../services/branch.service';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-branch-detail',
  imports: [ CommonModule],
  templateUrl: './branch-detail.component.html',
  styleUrl: './branch-detail.component.scss'
})
export class BranchDetailComponent{
  constructor(
    public dialogRef: MatDialogRef<BranchDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public branch: Branch
  ) {}

  close(): void {
    this.dialogRef.close();
  }

}
