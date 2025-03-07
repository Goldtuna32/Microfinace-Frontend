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
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatMenuModule,
    MatButtonModule
  ],
  templateUrl: './cif-list.component.html',
  styleUrls: ['./cif-list.component.scss']
})
export class CifListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['SerialNumber', 'name', 'nrcNumber', 'dob', 'phoneNumber', 'email', 'actions'];
  dataSource = new MatTableDataSource<CIF>([]);
  loading = true;
  errorMessage = '';
  isDeletedView = false;
  totalElements = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private cifService: CifService,
    private router: Router,
    private dialog: MatDialog,
    private currentAccountService: CurrentAccountService
  ) {}

  ngOnInit(): void {
    this.loadCIFs(0, 10); // Fetch 10 CIFs per page
  }

  loadCIFs(page: number = 0, pageSize: number = 10) {
    this.loading = true;
    this.errorMessage = '';
  
    const sortBy = this.sort?.active || 'id';
    const direction = this.sort?.direction || 'asc';
  
    const cifObservable = this.isDeletedView
      ? this.cifService.getDeletedCIFs(page, pageSize, sortBy, direction)
      : this.cifService.getAllCIFs(page, pageSize, sortBy, direction);
  
    cifObservable.subscribe({
      next: (response) => {
        console.log('✅ API Response:', response); // 🔍 Debug API response
  
        if (!response || !response.content) {
          console.warn('⚠️ No content found in API response');
          this.dataSource.data = [];
          this.totalElements = 0;
          this.errorMessage = 'No CIFs found.';
        } else {
          this.dataSource.data = response.content;
          this.totalElements = response?.totalElements ?? 0;  // ✅ Ensures a valid number
          // ✅ Assign total elements correctly
  
          console.log('✅ Total Elements:', this.totalElements); // 🔍 Debug total count
  
          if (this.paginator) {
            this.paginator.length = this.totalElements; // ✅ Ensure paginator updates
            this.paginator.pageIndex = page;
            this.paginator.pageSize = pageSize;
            console.log(`✅ Updated paginator: PageIndex=${this.paginator.pageIndex}, PageSize=${this.paginator.pageSize}, Length=${this.paginator.length}`);
          }
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ API Error:', error);
        this.loading = false;
        this.errorMessage = 'Failed to load CIF list.';
        this.dataSource.data = [];
        this.totalElements = 0;
        if (this.paginator) this.paginator.length = 0;
      }
    });
  }
  
  
  
  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.loadCIFs(0, this.paginator.pageSize);
    });
  
    this.paginator.page.subscribe((event) => {
      console.log(`Page changed: ${event.pageIndex}, PageSize: ${event.pageSize}`);
      this.loadCIFs(event.pageIndex, event.pageSize);
    });
  
    setTimeout(() => {
      if (this.paginator) {
        console.log('✅ Initial paginator setup:', this.paginator);
        this.paginator.length = this.totalElements;
      }
    }, 500); // Delay to ensure proper initialization
  }
  
  
  

  toggleView() {
    this.isDeletedView = !this.isDeletedView;
    this.loadCIFs(0, 10);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); // Reset to first page on filter change
    }
  }
  

  onPageChange(event: any) {
    this.loadCIFs(event.pageIndex, 10);
  }

  editCIF(cif: CIF) {
    const dialogRef = this.dialog.open(CifEditComponent, {
      width: '400px',
      data: { ...cif }
    });

    dialogRef.afterClosed().subscribe((updatedCif: FormData) => {
      if (updatedCif) {
        const id = updatedCif.get('id');
        if (!id || isNaN(Number(id))) {
          console.error('Invalid ID from FormData:', id);
          alert('Failed to update CIF: Invalid ID.');
          return;
        }

        const updatedCifData: any = {};
        updatedCif.forEach((value, key) => {
          updatedCifData[key] = value;
        });

        this.cifService.updateCIF(Number(id), updatedCif).subscribe({
          next: () => {
            this.loadCIFs(this.paginator.pageIndex, 10);
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
        this.loadCIFs(this.paginator.pageIndex, 10);
      }
    });
  }

  restoreCIF(id: number) {
    if (confirm('Are you sure you want to restore this CIF?')) {
      this.cifService.restoreCIF(id).subscribe({
        next: () => {
          alert('CIF restored successfully.');
          this.loadCIFs(this.paginator.pageIndex, 10);
        },
        error: (error) => {
          alert('Failed to restore CIF.');
          console.error('Error restoring CIF:', error);
        }
      });
    }
  }

  deleteCIF(id: number) {
    if (confirm('Are you sure you want to delete this CIF?')) {
      this.cifService.deleteCIF(id).subscribe({
        next: () => {
          alert('CIF deleted successfully.');
          this.loadCIFs(this.paginator.pageIndex, 10);
        },
        error: (error) => {
          alert('Failed to delete CIF.');
          console.error('Error deleting CIF:', error);
        }
      });
    }
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
}