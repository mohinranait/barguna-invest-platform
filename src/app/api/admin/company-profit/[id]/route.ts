import { connectDB } from "@/lib/db";
import { isAuth } from "@/lib/helpers";
import { CompanyProfit } from "@/models/company-profit.model";
import { ProfitDistribution } from "@/models/profit-distribution.model";
import { User } from "@/models/user.model";
import { AnyBulkWriteOperation } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// Update company profit request for admin approval
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {

        await connectDB()

        const companyProfitId = await params.id;
        const authUser = await isAuth()
        if (!authUser || authUser?.userId === "") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        if ( authUser?.role !== "manager" && authUser?.role !== 'admin' ) {
            return NextResponse.json({ error: "Access Forbidden" }, { status: 403 })
        }

        const body = await req.json()
        const profit = await CompanyProfit.findByIdAndUpdate(companyProfitId,{...body },{new:true, runValidators:true})
        console.log({profit});
        
        if ( !profit ) {
            return NextResponse.json({ error: "not-found" }, { status: 404 })
        }

        
        
         if(body?.distributed){
                   
                // get all users
                const users = await User.find({}).select('balance profitEarned').lean();
    
                if (users.length === 0) {
                    return NextResponse.json({ error: "No users found" }, { status: 404 });
                }
    
                // Sum all user blance
                const totalInvested = users.reduce((acc, user) => acc + (user.balance || 0), 0);
                if (totalInvested <= 0) {
                    return NextResponse.json({ error: "Invalid total invested" }, { status: 400 });
                }
    
                const userOps : AnyBulkWriteOperation[]  = [];
                const profitOps : AnyBulkWriteOperation[]  = [];
    
    
                users?.forEach( async user => {
                    
                    // User balance
                    const userInvestment = user.balance || 0;
                    // Investment percentage
                    const percent = userInvestment / totalInvested;
                    // User profit amount
                    const userProfit = percent * profit.amount;
                    
                    userOps.push({
                        updateOne:{
                            filter: {_id: user?._id },
                            update: {
                                $inc: {
                                    profitEarned: profit?.type === 'increase' ?  userProfit: -userProfit ,
                                    balance: profit?.type === 'increase' ?  userProfit: -userProfit 
                                }
                            }
                        }
                    })
                    
    
                    profitOps.push({
                        insertOne:{
                            document: {
                                createdBy: authUser.userId,
                                profitId: profit._id ,
                                userInvestment ,
                                userProfitAmount: userProfit,
                                adminNote: "",
                            }
                        }
                    })
                })
    
                await User.bulkWrite(userOps);
                await ProfitDistribution.bulkWrite(profitOps);
    
            }
        
        return NextResponse.json(
            {
                profit
            },
            { status: 200 },
        )

    } catch (error) {
        console.error("Profit error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}