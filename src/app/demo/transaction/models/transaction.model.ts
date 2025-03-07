export interface AccountTransaction {
    id: number;
    transactionType: 'CREDIT' | 'DEBIT';
    amount: number;
    transactionDate?: Date;
    transactionDescription: string;
    currentAccountId: number;
    status:string;
}
