export interface HpRegistration {
  id?: number;
  hpNumber: string;
  createdDate?: string;
  gracePeriod: number;
  loanAmount: number;
  downPayment: number;
  loanTerm: number;
  interestRate: string;
  lateFeeRate: number;
  ninetyDayLateFeeRate: number;
  oneHundredAndEightyLateFeeRate: number;
  startDate: string;
  endDate: string;
  status: number;
  currentAccountId: number;
  hpProductId: number;
}