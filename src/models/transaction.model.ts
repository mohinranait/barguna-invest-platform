import mongoose, { models, Types } from "mongoose"

const transactionSchema = new mongoose.Schema(
  {
    createdBy: { type: Types.ObjectId, ref:"User", required:true },
    updatedBy: { type: Types.ObjectId },
    amount: { type: Number, required: true, },
    paymentMethod: { type: String, enum: ['bkash', 'nagad',"HandCash"], default:'bkash' },
    senderPhone: { type: String,  },
    receiverPhone: { type: String,  },
    transactionId: { type: String },
    status: { type: String, enum: ["pending", "approved",'verified', "cancel", "rejected"], default: "pending" },
    transactionType:{type: String, enum: ['withdraw','deposit'] },
    note:{type: String },
    requestDate: { type: Date, default: Date.now },
    processDate: { type: Date },
  },
  { timestamps: true },
)

export const Transaction = models.Transaction || mongoose.model("Transaction", transactionSchema)