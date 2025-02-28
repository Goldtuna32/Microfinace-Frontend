export interface Address {
    id: number;
    region: string;
    district: string;
    township: string;
    street: string;
  }
  
  export interface Branch {
    id: number;
    branchName: string;
    branchCode: string;
    phoneNumber: string;
    email: string;
    createdDate: string; // Store as ISO date string
    updatedDate: string;
    status: number; // 1 for Active, 0 for Inactive
    address: Address;
  }
  