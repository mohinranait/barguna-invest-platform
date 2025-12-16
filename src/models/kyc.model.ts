import mongoose, { Types } from "mongoose"

const kycSchema = new mongoose.Schema(
  {
    userId: { type: Types.ObjectId, ref:"User", required:true }, 
  
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
    },
    profile: {
      type: String,
      url: String,
    },
  },
  { timestamps: true },
)

export const Kyc = mongoose.models.Kyc || mongoose.model("Kyc", kycSchema)