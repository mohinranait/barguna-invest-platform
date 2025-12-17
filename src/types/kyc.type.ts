export interface INid {
    nidNumber: string;
    verify: boolean;
    front: string;
    back: string;
}
export interface IPassportAndLicence {
    number: string;
    verify: boolean;
    front: string;
    back: string;
    issueDate: Date | null;
    expireDate: Date | null;
}

type TUserId = {
    _id: string;
    fullName: string;
}
export interface IKyc {
    _id: string;
    userId: TUserId;
    nid: INid;
    passport: IPassportAndLicence;
    drivingLicence: IPassportAndLicence;
    profile: string;
    updatedAt: Date;
    status: "Pending" | 'Need NID' | "Need Passport" | "Need Licence" | "Verified"
}