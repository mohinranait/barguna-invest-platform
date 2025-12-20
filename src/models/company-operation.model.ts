import { model, models, Schema, Types } from "mongoose"

const companyOperation = new Schema(
  {
    createdBy: { type: Types.ObjectId, ref:"User", required:true },
    amount: { type: Number, required: true, },
    type: {
        type: String,
        enum: ['profit',"running","loss"],
        default: 'profit'
    },
    distributed: {
      type: Boolean,
      default:false,
    },
    note: {
        type: String,
    },
  },
  { timestamps: true },
)

export const CompanyOperation = models.CompanyOperation || model("CompanyOperation", companyOperation)