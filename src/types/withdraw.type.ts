export type IWithdrawStatus = "pending" | "approved" | "rejected";
export type IWithdrawMethod = 'bkash' | 'nagad' | "HandCash";

type BaseWithdraw = {
    amount: number;
    method: IWithdrawMethod ;
    status: IWithdrawStatus;
    accountNumber: string;
    adminNote: string;
};

export interface IWithdrawRequest extends BaseWithdraw  {
    createdBy: string,    
}

export type TCreatedByUser = {
    _id: string,
    email: string,
    fullName: string,
    phone: string
}
export interface IWithdraw extends BaseWithdraw  {
    _id: string,
    createdBy: TCreatedByUser,
    updatedBy: TCreatedByUser;
    createdAt: Date,
    updatedAt: Date ,
}