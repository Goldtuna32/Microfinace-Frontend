import { SmeLoanCollateral } from "./SmeLoanCollateral.model";
import { SmeLoanRegistration } from "./SmeLoanRegistration.model";

export interface LoanRegistrationRequest {
 loan: SmeLoanRegistration;
  collaterals: SmeLoanCollateral[];
}