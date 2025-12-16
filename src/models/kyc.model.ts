import mongoose, { Types } from "mongoose"

const userSchema = new mongoose.Schema(
  {
    userId: { type: Types.ObjectId, ref:"User", required:true }, 
  
    nid: {
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
    },
    profile: {
      type: String,
      url: String,
    },
   
  },
  { timestamps: true },
)

export const User = mongoose.models.User || mongoose.model("User", userSchema)