import { CIF } from "../../cif/models/cif.model";
import { SmeLoanCollateral } from "./SmeLoanCollateral.model";

export interface SmeLoanRegistration {
  id?: number;
  loanAmount: number;
  interestRate: number;
  late_fee_rate: number;
  ninety_day_late_fee_rate: number;
  one_hundred_and_eighty_day_late_fee_rate: number;
  gracePeriod: number;
  repaymentDuration: number;
  documentFee: number;
  serviceCharges: number;
  status: number;
  dueDate?: string;
  repaymentStartDate?: string;
  currentAccountId: number;
  accountNumber?: string;
  cif?: CIF;
  cifDetails?: CIF; // Add this to match backend DTO
  collaterals?: SmeLoanCollateral[];
  totalCollateralAmount?: number;
  currentAccountDetails?: { // Add this to match backend DTO
    accountNumber: string;
    balance: number;
    cifId?: number;
  };
}