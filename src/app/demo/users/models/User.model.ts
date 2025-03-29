export interface User {
    id: number;
    username: string;
    email: string;
    password?: string;
    phoneNumber: string;
    dob?: string;
    profilePicture: string;
    status: number;
    roleId: number;
    branchId: number;
    permissions: Permission[];
}

export interface Permission {
    id: number;
    name: string; // e.g., READ, CREATE
    permissionFunction: string; // e.g., CIF
    description: string;
}