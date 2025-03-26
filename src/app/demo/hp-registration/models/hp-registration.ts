export interface HpRegistration {
    getAllHpRegistrations(): unknown;
    id?: number;
    hpNumber: string;
    createdDate?: string;
    loanAmount: number;
    downPayment: number;
    loanTerm: number;
    interestRate: string;
    startDate: string;
    endDate: string;
    status: number;
    currentAccountId: number;
    hpProductId: number;
  }
  