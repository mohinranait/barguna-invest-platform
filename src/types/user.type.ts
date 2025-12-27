
export type TUserRole = 'admin' | 'member' | 'manager'
export type TUserStatus = 'active' | 'pending' | 'suspended' | 'rejected';
export type TUserKycStatus = 'approved' | 'pending' | 'rejected';
export interface IUserRequest {
    fullName: string;
    email: string;
    phone: string;
    role: TUserRole;
    status: TUserStatus;
    kycStatus: TUserKycStatus;
    balance: number;
    investedAmount: number;
    withdrawAmount: number;
    profitEarned: number;
    dateOfBirth: string ;
    address:  string;
}


export interface IUser extends IUserRequest {
    _id: string;
    createdAt: string;
    updatedAt: string;
}