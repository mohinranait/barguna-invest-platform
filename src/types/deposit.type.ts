
export type TDepositMethod  = 'bkash' | "nagad" | "HandCash";
export type TDepositStatus  = "pending" | "approved" | "rejected";

// Base Deposit type
type BaseDeposit = {
    amount: number;
    paymentMethod: TDepositMethod;
    transactionId: string;
    depositNumber: string;
    status: TDepositStatus;
}

// This type for form
export interface IDepositRequest extends BaseDeposit {
     createdBy: string;
}

export type CreatedByUser = {
    _id: string;
    email: string;
    fullName: string;
    phone: string;
}

// This is Deposit type
export interface IDeposit  extends BaseDeposit
{
    _id: string;
    createdBy: CreatedByUser;
    note: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
}