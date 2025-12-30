

export type OwnerByUser = {
    _id: string;
    email: string;
    fullName: string;
    phone: string;
}


export interface IDistributionRecord {
    _id: string;
    createdBy: string;
    ownerBy: OwnerByUser;
    userInvestment: number;
    userProfitAmount: number;
    totalInvested: number;
    distribution: string;
    ratio: string;
}