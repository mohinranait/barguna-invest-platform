import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ["member", "manager", "admin"], default: "member" },
    status: { type: String, enum: ["pending", "active", "suspended", "rejected"], default: "pending" },
    kycStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    investedAmount: { type: Number, default: 0 },
    withdrawAmount: { type: Number, default: 0 },
    profitEarned: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    address: { type: String },
    dateOfBirth: { type: String },

    bankAccount: {
      accountName: String,
      accountNumber: String,
      bankName: String,
    },
    bkashNumber: String,
    nagadNumber: String,
    kycDocuments: {
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
      }
    },
    verifiedAt: Date,
    profile: {
      type: String,
      url: String,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

export const User = mongoose.models.User || mongoose.model("User", userSchema)