import { model, models, Schema } from "mongoose";

const CompanyWalletSchema = new Schema({
    totalFund: { type: Number, default: 0 },    
    investedFund: { type: Number, default: 0 },  
    availableFund: { type: Number, default: 0 }, 
}, { timestamps: true });


export const CompanyWallet = models.CompanyWallet || model("CompanyWallet", CompanyWalletSchema)

