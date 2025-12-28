import { model, models, Schema } from "mongoose";

const CompanyWalletSchema = new Schema({
    totalBalance: { type: Number, default: 0 },
    availableBalance: { type: Number, default: 0 }, 
}, { timestamps: true });


export const CompanyWallet = models.CompanyWallet || model("CompanyWallet", CompanyWalletSchema)

