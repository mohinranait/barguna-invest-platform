import { model, models, Schema, Types } from "mongoose"

const withdrawalSchema = new Schema(
  {
    createdBy: { type: Types.ObjectId, ref:"User", required:true },
    updatedBy: { type: Types.ObjectId, ref:"User" },
    amount: { type: Number, required: true, },
    method: {
        type: String,
        enum: ['bkash',"nagad" , "HandCash"],
        default: 'bkash'
    },
    status: {
        type: String,
        enum: ["pending" , "approved" , "rejected"],
        default:'pending'
    },
    accountNumber: String,
    adminNote: String
  },
  { timestamps: true },
)

export const Withdrawal = models.Withdrawal || model("Withdrawal", withdrawalSchema)