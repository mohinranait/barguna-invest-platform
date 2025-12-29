
import { model, models, Schema } from "mongoose";

const distributionSchema = new Schema({
    createdBy: { type: Schema.Types.ObjectId, ref:"User", required:true },
    amount: { type: Number, required: true },
    members: { type: Number, required: true },
    status: {   type: String, enum: ['Pending', 'Completed'], required: true },
},{timestamps:true})


export const Distribution = models.Distribution || model("Distribution", distributionSchema)