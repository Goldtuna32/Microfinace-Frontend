// src/app/models/notification.ts
export interface Notification {
    id: number;
    accountId: number;
    type: string;
    message: string;
    createdAt: string; // ISO date string
    isRead: boolean;
    smeLoanId?: number; // Optional
  }