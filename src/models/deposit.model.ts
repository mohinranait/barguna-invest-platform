import mongoose, { models, Schema, Types } from "mongoose"

const depositSchema = new Schema(
  {
    createdBy: { type: Types.ObjectId, ref:"User", required:true },
    updatedBy: { type: Types.ObjectId, ref:"User" },
    amount: { type: Number, required: true, },
    paymentMethod: {
        type: String,
        enum: ['bkash',"nagad" , "hand cash"],
        default: 'bkash'
    },
    transactionId: String,
    status: {
        type: String,
        enum: ["pending" , "approved" , "rejected"],
        default:'pending'
    }
  },
  { timestamps: true },
)

export const Deposit = models.Deposit || mongoose.model("Deposit", depositSchema)