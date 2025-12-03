import mongoose, { models, Types } from "mongoose"

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: Types.ObjectId, ref:"User", required:true },
    updatedMans: [
        {
            userId: { type: Types.ObjectId, ref:"User", required:true },
        }
    ],
    amount: { type: Number, required: true, },
    paymentMethod: { type: String, enum: ['bKash', 'Nagad',"HandCash"], default:'bKash' },
    senderPhone: { type: String,  },
    transactionId: { type: String },
    status: { type: String, enum: ["pending", "approved", "cancel", "rejected"], default: "pending" },
    kycStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    transactionType:{type: String, enum: ['withdraw','deposit'] },
    note:{type: String },
    requestDate: { type: Date, default: Date.now },
    processDate: { type: Date },
  },
  { timestamps: true },
)

export const Transaction = models.Transaction || mongoose.model("Transaction", transactionSchema)