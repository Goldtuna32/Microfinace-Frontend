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
  one_hundred_and_eighty_late_fee_rate: number;
  status: number;
  currentAccountId: number;
  bankPortion?: number;
  hpProductId: number;
}