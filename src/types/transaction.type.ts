export type ITransactionType = "deposit" | "profit" | "withdraw";

type BaseTransaction = {
    amount: number;
    type: ITransactionType;
    referenceId: string;
   
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
    createdAt: Date,
    updatedAt: Date ,
}