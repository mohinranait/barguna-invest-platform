export type ITransactionStatus = "pending" | "approved"| 'verified' | "cancel" | "rejected";
export type ITransactionMethod = 'bkash' | 'nagad' | "HandCash";
export type ITransactionType = 'withdraw'|'deposit';

type BaseTransaction = {
    amount: number;
    paymentMethod: ITransactionMethod;
    senderPhone?: string;
    receiverPhone?: string;
    transactionId?: string;
    status: ITransactionStatus;
    transactionType: ITransactionType;
    note?: string;
    processDate?: Date;
};

export interface ITransactionForm extends BaseTransaction  {
    createdBy: string,    
}

export type createdByUser = {
    _id: string,
    email: string,
    fullName: string,
    phone: string
}
export interface ITransaction extends BaseTransaction  {
    _id: string,
    createdBy: createdByUser,
    requestDate?: Date,
    createdAt: Date,
    updatedAt: Date ,
}