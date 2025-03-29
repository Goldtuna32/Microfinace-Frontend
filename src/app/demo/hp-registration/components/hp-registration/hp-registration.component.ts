import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HpRegistration } from '../../models/hp-registration';

@Component({
  selector: 'app-hp-registration',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './hp-registration.component.html',
  styleUrls: ['./hp-registration.component.scss']
})
export class HpRegistrationComponent implements OnInit {
  hp: HpRegistration = {
    hpNumber: '',
    gracePeriod: 0,
    loanAmount: 0,
    downPayment: 0,
    loanTerm: 0,
    interestRate: '',
    lateFeeRate: 0,
    ninetyDayLateFeeRate: 0,
    oneHundredAndEightyLateFeeRate: 0,
    startDate: '',
    endDate: '',
    status: 1,
    currentAccountId: 0,
    hpProductId: 0
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
    console.log('Submitting HP Registration:', this.hp);
    
    this.http.post('http://localhost:8080/api/hp-registrations', {
      hpNumber: this.hp.hpNumber,
      gracePeriod: this.hp.gracePeriod,
      loanAmount: this.hp.loanAmount,
      downPayment: this.hp.downPayment,
      loanTerm: this.hp.loanTerm,
      interestRate: this.hp.interestRate,
      late_fee_rate: this.hp.lateFeeRate,
      ninety_day_late_fee_rate: this.hp.ninetyDayLateFeeRate,
      one_hundred_and_eighty_day_late_fee_rate: this.hp.oneHundredAndEightyLateFeeRate,
      startDate: this.hp.startDate,
      endDate: this.hp.endDate,
      status: this.hp.status,
      currentAccount: { id: this.hp.currentAccountId }, // Send as object with id
      hpProductId: this.hp.hpProductId
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
