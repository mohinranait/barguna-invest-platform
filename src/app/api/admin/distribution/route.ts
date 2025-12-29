import { connectDB } from "@/lib/db";
import { isAuth } from "@/lib/helpers";
import { CompanyWallet } from "@/models/CompanyWallet.model";
import { Distribution } from "@/models/distribution.model";
import { ProfitDistribution } from "@/models/profit-distribution.model";
import { Transaction } from "@/models/transaction.model";
import { User } from "@/models/user.model";
import { AnyBulkWriteOperation } from "mongoose";
import { NextRequest, NextResponse } from "next/server";


// Distribute company profit among users
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Authenticate user
        const authUser = await isAuth()
        if (!authUser || authUser?.userId === "") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Authorization check
        if ( authUser?.role !== "manager" && authUser?.role !== 'admin' ) {
            return NextResponse.json({ error: "Access Forbidden" }, { status: 403 })
        }

        // Connect to DB
        await connectDB();


        // Share company profit or loss  
        // get all users
        const users = await User.find({}).select('balance profitEarned').lean();

        if (users.length === 0) {
            return NextResponse.json({ error: "No users found" }, { status: 404 });
        }


        // Create distribution record
        const distribution = new Distribution({
            createdBy: authUser.userId,
            amount: body.amount,
            members: users.length,
            status: "Completed",
        })
        await distribution.save();

        // Sum all user blance
        const totalInvested = users.reduce((acc, user) => acc + (user.balance || 0), 0);
        if (totalInvested <= 0) {
            return NextResponse.json({ error: "Invalid total invested" }, { status: 400 });
        }

        const userOps : AnyBulkWriteOperation[]  = [];
        const profitOps : AnyBulkWriteOperation[]  = [];
        const transactionOps : AnyBulkWriteOperation[]  = [];


        users?.forEach( async user => {
            
            // User balance
            const userInvestment = user.balance || 0;
            // Investment percentage
            const percent = userInvestment / totalInvested;
            // User profit amount
            const userProfit = percent * body.amount;
            

            // Update user profit and balance
            userOps.push({
                updateOne:{
                    filter: {_id: user?._id },
                    update: {
                        $inc: {
                            profitEarned:  userProfit,
                            balance:  userProfit 
                        }
                    }
                }
            })
            

            // Create profit distribution record
            profitOps.push({
                insertOne:{
                    document: {
                        createdBy: authUser.userId,
                        ownerBy: user._id,
                        userInvestment: userInvestment,
                        userProfitAmount: userProfit,
                        totalInvested,
                        ratio: percent,
                        distribution: distribution._id
                    }
                }
            })

            // Create transaction record
            transactionOps.push({
                insertOne:{
                    document: {
                        createdBy: authUser?.userId,
                        ownerBy: user._id,
                        amount: userProfit,
                        type: "profit",
                    }
                }
            })
        })

        await User.bulkWrite(userOps);
        await ProfitDistribution.bulkWrite(profitOps);
        await Transaction.bulkWrite(transactionOps);


        


        // Update company wallet total balance
        const wallet = await CompanyWallet.findOneAndUpdate({},{
            $inc: {
                totalBalance: body.amount,
            }
        },{new :true, runValidators:true})

        return NextResponse.json(
            {
                wallet
            },
            { status: 200 },
        )
        

    } catch (error) {
        console.error("Distribution error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}