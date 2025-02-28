import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CifService } from '../../services/cif.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CifEditComponent } from '../cif-edit/cif-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { CurrentAccountComponent } from 'src/app/demo/current-account/components/current-account/current-account.component';
import { CurrentAccountService } from 'src/app/demo/current-account/services/current-account.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CifDetailModalComponent } from '../cif-detail-modal/cif-detail-modal.component';
import { CIF } from '../../models/cif.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-cif-list',
  standalone: true,
  imports: [ CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatProgressSpinnerModule, MatTooltipModule, MatMenuModule, MatButtonModule],
  templateUrl: './cif-list.component.html',
  styleUrl: './cif-list.component.scss'
})

export class CifListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['SerialNumber', 'name', 'nrcNumber', 'dob', 'phoneNumber', 'email', 'actions'];
  dataSource = new MatTableDataSource<CIF>([]);
  loading = true;
  errorMessage = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private cifService: CifService,
    private router: Router,
    private dialog: MatDialog,
    private currentAccountService: CurrentAccountService
  ) {}

  ngOnInit(): void {
    this.loadCIFs();
  }

  openCifDetailDialog(cif: CIF) {
    this.dialog.open(CifDetailModalComponent, {
      width: '90%',
      maxWidth: '900px',
      height: 'auto',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
      data: cif
    });
  }

  ngAfterViewInit(): void {
    // Ensure paginator & sorting are set after view initializes
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadCIFs() {
    this.cifService.getAllCIFs().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        
        
        // Manually loop through CIFs to check for current account status
        data.forEach((cif, index) => {
          this.currentAccountService.hasCurrentAccount(cif.id).subscribe({
            next: (hasAccount) => {
              this.dataSource.data[index].hasCurrentAccount = hasAccount;
            },
            error: (error) => {
              console.error(`Error checking account for CIF ${cif.id}:`, error);
            }
          });
        });

        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching CIFs:', error);
        this.loading = false;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // Ensure filter resets paginator to first page
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editCIF(cif: CIF) {
    const dialogRef = this.dialog.open(CifEditComponent, {
      width: '400px',
      data: { ...cif }
    });
  
    dialogRef.afterClosed().subscribe((updatedCif: FormData) => {
      if (updatedCif) {
        const id = updatedCif.get('id');
        console.log('Received FormData from dialog:', updatedCif);
        console.log('Extracted id from FormData:', id);
  
        if (!id || isNaN(Number(id))) {
          console.error('Invalid ID from FormData:', id);
          alert('Failed to update CIF: Invalid ID.');
          return;
        }
  
        const updatedCifData: any = {};
        updatedCif.forEach((value, key) => {
          updatedCifData[key] = value;
        });
        console.log('Converted FormData to object:', updatedCifData);
  
        this.cifService.updateCIF(Number(id), updatedCif).subscribe({
          next: () => {
            const index = this.dataSource.data.findIndex(item => item.id === Number(id));
            if (index !== -1) {
              this.dataSource.data[index] = updatedCifData;
              this.dataSource._updateChangeSubscription();
            }
            alert('CIF updated successfully!');
          },
          error: (error) => {
            alert('Failed to update CIF.');
            console.error('Error updating CIF:', error);
          }
        });
      }
    });
  }

  openCurrentAccountDialog(row: CIF) {
    const dialogRef = this.dialog.open(CurrentAccountComponent, {
      width: '400px',
      data: { cifId: row.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Current Account Created:', result);
      }
    });
  }

  deleteCIF(id: number) {
    if (confirm('Are you sure you want to delete this CIF?')) {
      this.cifService.deleteCIF(id).subscribe({
        next: () => {
          alert('CIF deleted successfully.');
          this.loadCIFs();
        },
        error: (error) => {
          alert('Failed to delete CIF.');
          console.error('Error deleting CIF:', error);
        }
      });
    }
  }
}
