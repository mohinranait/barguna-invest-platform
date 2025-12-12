
export type TProfitType  = 'increase' | "decrease" ;

// Base Deposit type
type BaseProfit = {
    amount: number;
    type: TProfitType;
    note: string;
    distributed: boolean;
}

// This type for form
export interface IProfitRequest extends BaseProfit {
     createdBy: string;
}

export type CreatedByUser = {
    _id: string;
    email: string;
    fullName: string;
    phone: string;
}

// This is Deposit type
export interface ICompanyProfit  extends BaseProfit
{
    _id: string;
    createdBy: CreatedByUser;
    note: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
}
