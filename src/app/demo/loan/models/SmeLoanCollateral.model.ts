import { Collateral, CollateralStatus } from "../../collateral/models/collateral.model";

// src/app/models/sme-loan-collateral.model.ts
export interface SmeLoanCollateral {
    id?: number;
    collateralId: number;
    collateralCode: string;
    collateralAmount: number;
    status: CollateralStatus;
    f_collateral_photo: string;
    b_collateral_photo: string;
    date: string;
  description: string
  value: number;
  }