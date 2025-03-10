// src/app/models/hp-product.ts
export interface HpProduct {
    id: number;
    name: string;
    status: number;
    price: number; // Using number for simplicity; adjust to string if BigDecimal precision is needed
    productTypeId: number;
    dealerRegistrationId: number;
    commissionFee: number; // Same note as price
    hpProductPhoto: string;
  }
  
  export interface HpProductCreate {
    name: string;
    status?: number; // Optional, defaults to 1
    price: number;
    productTypeId: number;
    dealerRegistrationId: number;
    commissionFee: number;
    hpProductPhoto?: string;
  }