import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hp-registration',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './hp-registration.component.html',
  styleUrls: ['./hp-registration.component.scss']
})
export class HpRegistrationComponent implements OnInit {
  hp: any = {
    hpNumber: '',
    loanAmount: null,
    downPayment: null,
    loanTerm: null,
    interestRate: '',
    startDate: '',
    endDate: '',
    status: 1,
    currentAccount: null,
    hpProduct: null
  };

  currentAccounts: any[] = [];
  hpProducts: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchCurrentAccounts();
    this.fetchHpProducts();
  }

  fetchCurrentAccounts() {
    this.http.get<any[]>('http://localhost:8080/api/current-accounts').subscribe(data => {
      this.currentAccounts = data;
    });
  }

  fetchHpProducts() {
    this.http.get<any[]>('http://localhost:8080/api/hp-products').subscribe(data => {
      this.hpProducts = data;
    });
  }

  onSubmit() {
    this.hp.currentAccount = Number(this.hp.currentAccount); // Convert to number
    this.hp.hpProduct = Number(this.hp.hpProduct); // Convert to number
  
    console.log('Submitting HP Registration:', this.hp);
    
    this.http.post('http://localhost:8080/api/hp-registrations', {
      hpNumber: this.hp.hpNumber,
      loanAmount: this.hp.loanAmount,
      downPayment: this.hp.downPayment,
      loanTerm: this.hp.loanTerm,
      interestRate: this.hp.interestRate,
      startDate: this.hp.startDate,
      endDate: this.hp.endDate,
      status: this.hp.status,
      currentAccount: this.hp.currentAccount, // Send only ID
      hpProduct: this.hp.hpProduct // Send only ID
    }).subscribe(
      response => {
        console.log('Saved successfully:', response);
        alert('HP Registration saved!');
      },
      error => {
        console.error('Error saving HP Registration:', error);
        alert('Error occurred while saving.');
      }
    );
  }
  
}
