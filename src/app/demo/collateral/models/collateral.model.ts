export type CollateralStatus = 1 | 0;

export interface Collateral {
  id?: number; // Optional, assuming it might exist in the full DTO
  collateralCode: string;
  description: string;
  value: number; // BigDecimal maps to number in TypeScript
  f_collateral_photo: string; // Renamed to camelCase for TS convention
  b_collateral_photo: string; // Renamed to camelCase for TS convention
  status: CollateralStatus;
  date: string; // ISO date string (e.g., "2023-01-01")
}