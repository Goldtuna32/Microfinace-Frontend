import { CIF } from "../../cif/models/cif.model";
import { SmeLoanCollateral } from "./SmeLoanCollateral.model";

export interface SmeLoanRegistration {
  id?: number;
  loanAmount: number;
  interestRate: number;
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