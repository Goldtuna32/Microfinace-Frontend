// hp-schedule.dto.ts
export interface HpScheduleDTO {
    id: number;
    date: Date;
    interestAmount: number;
    principalAmount: number;
    lateDay: number | null;
    lateFee: number | null;
    principalOd: string;
    interestOd: string;
    installmentNo: string;
    hpRegistrationId: number;
    lateFeePaidDate: Date | null;
  }