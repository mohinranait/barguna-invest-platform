import mongoose, { Types } from "mongoose"

const kycSchema = new mongoose.Schema(
  {
    userId: { type: Types.ObjectId, ref:"User", required:true }, 
    status: {
        type: String,
        enum: ['Pending',"Need NID","Need Passport","Need Licence","Verified"],
        default:"Pending"
    },
    nid: {
        nidNumber: {
            type: String,
        },
        verify: {
            type: Boolean,
        },
        front:{
            type: String,
        },
        back:{
            type: String,
        },
        note:{    type: String }
    },
    passport: {
        number: {
            type: String,
        },
        verify: {
            type: Boolean,
        },
        front:{
            type: String,
        },
        back:{
            type: String,
        },
        issueDate:{
            type: String,
        },
        expireDate:{
            type: String,
        },
        note:{    type: String }
    },
    drivingLicence: {
        number: {
            type: String,
        },
        verify: {
            type: Boolean,
        },
        front:{
            type: String,
        },
        back:{
            type: String,
        },
        issueDate:{
            type: String,
        },
        expireDate:{
            type: String,
        },
        note:{    type: String }
    },
    profile: {
      type: String,
      url: String,
    },
  },
  { timestamps: true },
)

export const Kyc = mongoose.models.Kyc || mongoose.model("Kyc", kycSchema)