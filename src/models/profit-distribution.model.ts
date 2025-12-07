import { model, models, Schema, Types } from "mongoose"

const distributionSchema = new Schema(
  {
    createdBy: { type: Types.ObjectId, ref:"User", required:true },
    profitId: { type: Types.ObjectId, ref:"CompanyProfit", required:true }  ,    
    userInvestment: { type: Number, required: true, },
    userProfitAmount: { type: Number, required: true, },
    adminNote: String,
  },
  { timestamps: true },
)

export const ProfitDistribution = models.ProfitDistribution || model("ProfitDistribution", distributionSchema)