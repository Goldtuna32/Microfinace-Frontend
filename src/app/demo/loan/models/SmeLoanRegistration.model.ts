import { CIF } from "../../cif/models/cif.model";
import { SmeLoanCollateral } from "./SmeLoanCollateral.model";

export interface SmeLoanRegistration {
  id?: number;
  loanAmount: number;
  interestRate: number;
  late_fee_rate: number; // Added
  ninety_day_late_fee_rate: number; // Added
  one_hundred_and_eighty_day_late_fee_rate: number; // Added
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
  
  collaterals?: SmeLoanCollateral[];
  totalCollateralAmount?: number;
  }