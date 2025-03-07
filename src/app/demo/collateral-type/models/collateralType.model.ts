export interface CollateralType {
    id?: number; // Optional because it's assigned by the backend on creation
    name: string;
    status: number; // 1 for active, 0 for inactive (soft-deleted)
  }