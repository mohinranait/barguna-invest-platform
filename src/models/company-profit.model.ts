import { model, models, Schema, Types } from "mongoose"

const companyProfit = new Schema(
  {
    createdBy: { type: Types.ObjectId, ref:"User", required:true },
    amount: { type: Number, required: true, },
    type: {
        type: String,
        enum: ['increase',"decrease"],
        default: 'increase'
    },
    note: {
        type: String,
    },
  },
  { timestamps: true },
)

export const CompanyProfit = models.CompanyProfit || model("CompanyProfit", companyProfit)