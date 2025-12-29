import { model, models, Schema, Types } from "mongoose"

const distributionRecordSchema = new Schema(
  {
    createdBy: { type: Types.ObjectId, ref:"User", required:true }, 
    ownerBy: { type: Types.ObjectId, ref:"User", required:true }, 
    userInvestment: { type: Number, required: true, },
    userProfitAmount: { type: Number, required: true, },
    totalInvested: { type: Number, required: true, },
    distribution: { type: Types.ObjectId, ref:"Distribution", required: true, },
    ratio: { type: Number, required: true, },
  },
  { timestamps: true },
)

export const ProfitDistribution = models.ProfitDistribution || model("ProfitDistribution", distributionRecordSchema)