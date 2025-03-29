export interface RepaymentSchedule {
    id: number;
    graceEndDate: string | null;
    interestAmount: number;
    principalAmount: number;
    lateFee: number | null;
    interestOverDue: number | null;
    dueDate: Date | string;
    status?: string;
    remainingPrincipal: number;
    createdAt: string;
    paidLate: boolean | null;
    lateFeePaidDate: string | null;
  }

