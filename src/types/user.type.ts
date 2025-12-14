

export interface IUser {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    role: 'admin' | 'member' | 'manager';
    status: 'active' | 'pending' | 'suspended' | 'rejected';
    kycStatus: 'approved' | 'pending' | 'rejected';
    investedAmount: number;
    dateOfBirth: Date ;
    address:  string;
    profitEarned: number;
    balance: number;
    createdAt: string;
    updatedAt: string;
}