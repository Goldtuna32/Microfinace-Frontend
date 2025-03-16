import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CifService } from '../../services/cif.service';
import { BranchService } from 'src/app/demo/branch/services/branch.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/alertservice/alert.service';
import { CIF } from '../../models/cif.model';

@Component({
  selector: 'app-cif-create',
  imports: [ ReactiveFormsModule, CommonModule],
  templateUrl: './cif-create.component.html',
  styleUrl: './cif-create.component.scss'
})
export class CifCreateComponent implements OnInit {
  cifForm!: FormGroup;
  branches: any[] = [];  // Stores Branch List
  nrcFormats: any[] = []; // Stores NRC Format Data
  selectedNrcPrefix = ''; // Selected NRC Prefix
  frontNrcFile: File | null = null;
  backNrcFile: File | null = null;
  errorMessage: string = '';
  frontNrcPreview: string | null = null;
  backNrcPreview: string | null = null;


  constructor(
    private fb: FormBuilder,
    private cifService: CifService,
    private branchService: BranchService,
    private http: HttpClient,
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.cifForm = this.fb.group({
      name: ['', Validators.required],
      nrcPrefix: ['', Validators.required], 
      nrcNumber: ['', Validators.required],
      dob: ['', [Validators.required, this.minimumAgeValidator]], 
      gender: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      occupation: ['', Validators.required],
      incomeSource: ['', Validators.required],
      branchId: ['', Validators.required],
    });


    this.branchService.getBranches().subscribe({
      next: (data) => (this.branches = data),
      error: (err) => console.error('Error loading branches:', err),
    });

    // ✅ Load NRC formats from JSON file
    this.http.get<any>('assets/nrc.json').subscribe({
      next: (data) => { this.nrcFormats = data.data; },
      error: (err) => { console.error('Error loading NRC formats:', err); }
    });

    this.cifForm.valueChanges.subscribe(() => {
      this.checkDuplicates();
    });
  }

  checkDuplicates(): void {
    const cifData: Partial<CIF> = {
      name: this.cifForm.get('name')?.value,
      nrcNumber: `${this.cifForm.get('nrcPrefix')?.value}/${this.cifForm.get('nrcNumber')?.value}`,
      phoneNumber: this.cifForm.get('phoneNumber')?.value,
      email: this.cifForm.get('email')?.value
    };

    this.cifService.checkDuplicate(cifData).subscribe({
      next: (isDuplicate) => {
        if (isDuplicate) {
          this.cifForm.get('name')?.setErrors({ duplicate: true });
          this.cifForm.get('nrcPrefix')?.setErrors({ duplicate: true });
          this.cifForm.get('nrcNumber')?.setErrors({ duplicate: true });
          this.cifForm.get('phoneNumber')?.setErrors({ duplicate: true });
          this.cifForm.get('email')?.setErrors({ duplicate: true });
        } else {
          this.cifForm.get('name')?.setErrors(null);
          this.cifForm.get('nrcPrefix')?.setErrors(null);
          this.cifForm.get('nrcNumber')?.setErrors(null);
          this.cifForm.get('phoneNumber')?.setErrors(null);
          this.cifForm.get('email')?.setErrors(null);
        }
      },
      error: (err) => {
        console.error('Error checking duplicates:', err);
        this.alertService.showError('Failed to check duplicates. Please try again.');
      }
    });
  }

  onNrcPrefixChange(event: any) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    console.log("🔍 Selected NRC Value:", selectedValue); // Debugging

    if (selectedValue) {
      // The value already contains the full prefix format from the template
      this.cifForm.get('nrcPrefix')?.setValue(selectedValue);
      console.log("✅ Updated Form Value:", this.cifForm.value);
    } else {
      console.error("❌ No NRC value selected!");
    }
  }
  


  // ✅ Validate Form
  isFormValid(): boolean {
    return this.cifForm.valid && this.nrcFormats.length > 0 && this.branches.length > 0;
  }

  minimumAgeValidator(control: any) {
    if (!control.value) return null; // ✅ If no date selected, don't show error
  
    const birthDate = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
  
    // ✅ Adjust age if birthday hasn't happened yet this year
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
  
    return age >= 18 ? null : { underage: true }; // ✅ Correct return value
  }  
  
  checkAge() {
    const dobControl = this.cifForm.get('dob');
    console.log("🛠️ DOB Control Errors:", dobControl?.errors); // ✅ Debugging
  
    if (dobControl?.errors?.['underage']) { 
      this.errorMessage = '❌ User must be at least 18 years old.';
    } else {
      this.errorMessage = '';
    }
  }
  


  onSubmit() {
    if (this.cifForm.invalid) {
      alert('Please fill in all required fields!');
      this.alertService.showError('Please fill in all required fields.');
      return;
    }
    let nrcPrefix = this.cifForm.get('nrcPrefix')?.value;
    const nrcNumber = this.cifForm.value.nrcNumber;
  
    if (!nrcPrefix || nrcPrefix === 'undefined') {
      this.alertService.showError('NRC Prefix is missing! Please select an NRC.');
      alert("❌ NRC Prefix is missing! Please select an NRC.");
      console.error("❌ NRC Prefix is missing from form!");
      return;
    }
  
    // ✅ Ensure the form has the correct value
    this.cifForm.patchValue({ nrcPrefix });
  
    // ✅ Create full NRC number
    const fullNrc = `${nrcPrefix}/${nrcNumber}`;
    console.log("✅ Full NRC to Submit:", fullNrc);
    const formData = new FormData();
    formData.append('name', this.cifForm.value.name);
    formData.append('nrcNumber', fullNrc);
    formData.append('dob', this.cifForm.value.dob);
    formData.append('gender', this.cifForm.value.gender);
    formData.append('phoneNumber', this.cifForm.value.phoneNumber);
    formData.append('email', this.cifForm.value.email);
    formData.append('address', this.cifForm.value.address);
    formData.append('maritalStatus', this.cifForm.value.maritalStatus);
    formData.append('occupation', this.cifForm.value.occupation);
    formData.append('incomeSource', this.cifForm.value.incomeSource);
    formData.append('branchId', this.cifForm.value.branchId);

    console.log('Form Data:', formData);
    

    if (this.frontNrcFile) {
      formData.append('fNrcPhotoUrl', this.frontNrcFile);
    }
    if (this.backNrcFile) {
      formData.append('bNrcPhotoUrl', this.backNrcFile);
    }


    this.cifService.createCIF(formData).subscribe({
      next: (response) => {
        console.log('CIF Created:', response);
        this.alertService.showSuccess('CIF created successfully!');
        this.router.navigate(['/cif/list']);
        this.cifForm.reset();
      },
      error: (error) => {
        console.error('Error Creating CIF:', error);
        this.alertService.showError('Failed to create CIF. Please try again.');
      },
    });
  }  

  onFileChange(event: any, type: string) {
    const file = event.target.files[0];
    if (file) {
      // Store the file for submission
      if (type === 'front') {
        this.frontNrcFile = file;
      } else if (type === 'back') {
        this.backNrcFile = file;
      }
  
      // Generate preview
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (type === 'front') {
          this.frontNrcPreview = e.target?.result as string;
        } else if (type === 'back') {
          this.backNrcPreview = e.target?.result as string;
        }
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };
      reader.readAsDataURL(file); // Convert file to base64 string for preview
    }
  }
}
