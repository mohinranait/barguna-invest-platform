
export type TOperationType  = 'income' | "expose"  ;

// Base Deposit type
type BaseOperation = {
    amount: number;
    type: TOperationType;
    note: string;
}

// This type for form
export interface IOperationRequest extends BaseOperation {
     createdBy: string;
     updatedBy: string;
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
    updatedBy: CreatedByUser;
    note: string;
    createdAt: Date;
    updatedAt: Date;
}
