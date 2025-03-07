export interface RepaymentSchedule {
    id: number;
    dueDate: string; // Using string since Angular will receive ISO date strings from the backend
    graceEndDate: string | null;
    interestAmount: number;
    principalAmount: number;
    lateFee: number | null;
    interestOverDue: number | null;
    status: number;
    remainingPrincipal: number;
    createdAt: string;
    paidLate: boolean | null;
    lateFeePaidDate: string | null;
  }