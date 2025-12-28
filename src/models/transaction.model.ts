import mongoose, { models, Types } from "mongoose"

const transactionSchema = new mongoose.Schema(
  {
    createdBy: { type: Types.ObjectId, ref:"User", required:true },
    ownerBy: { type: Types.ObjectId, ref:"User", required:true },
    amount: { type: Number, required: true, },
    type: {
      type: String,
      enum: ["deposit" , "profit" , "withdraw"],
      default:"deposit"
    },
    referenceId: {
        // depositId / withdrawId
        type: Types.ObjectId, 
    },
  },
  { timestamps: true },
)

export const Transaction = models.Transaction || mongoose.model("Transaction", transactionSchema)