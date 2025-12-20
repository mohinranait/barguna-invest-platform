
export type TOperationType  = 'profit' | "running" | "loss" ;

// Base Deposit type
type BaseOperation = {
    amount: number;
    type: TOperationType;
    note: string;
    distributed: boolean;
}

// This type for form
export interface IOperationRequest extends BaseOperation {
     createdBy: string;
}

export type CreatedByUser = {
    _id: string;
    email: string;
    fullName: string;
    phone: string;
}

// This is Deposit type
export interface ICompanyOperation  extends BaseOperation
{
    _id: string;
    createdBy: CreatedByUser;
    note: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
}
