export interface CIF {
    id: number;
    name: string;
    serialNumber: String;
    nrcNumber: string;
    dob: string; // Use string because JSON from API returns it as text
    gender: string;
    phoneNumber: string;
    email: string;
    address: string;
    maritalStatus: string;
    occupation: string;
    incomeSource: string;
    createdAt: string;
    branchId: number;
    hasCurrentAccount: boolean;
    fNrcPhotoUrl: string; // Cloudinary Front NRC Image
    bNrcPhotoUrl: string;
  }