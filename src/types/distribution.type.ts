
export interface IDistribution {
    _id: string;
    createdBy: string;
    amount: number;
    members: number;
    status: 'Pending' | 'Completed';
    createdAt: Date;
    updatedAt: Date;
}
