export interface INid {
    nidNumber: string,
    verify: boolean,
    front: string,
    back: string,
}
export interface IPassportAndLicence {
    number: string,
    verify: boolean,
    front: string,
    back: string,
    issueDate: Date | string,
    expireDate: Date | string,
}
export interface IKyc {
    _id: string,
    userId: string,
    nid: INid,
    passport: IPassportAndLicence,
    drivingLicence: IPassportAndLicence,
    profile: string
}