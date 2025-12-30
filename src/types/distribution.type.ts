
export interface IDistribution {
    createdBy: string;
    amount: number;
    members: number;
    status: 'Pending' | 'Completed';
    createdAt: Date;
    updatedAt: Date;
}
