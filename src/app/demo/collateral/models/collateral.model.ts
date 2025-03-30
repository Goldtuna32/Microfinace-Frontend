export interface Collateral {
  id: number;
  collateralCode: string;
  description: string;
  value: number;
  f_collateral_photo: string;
  b_collateral_photo: string;
  status: number; // Keep as number from backend
  date: string | Date;
  cifId?: number;
  collateralTypeId?: number;
}