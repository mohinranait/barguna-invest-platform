import { connectDB } from "@/lib/db"
import { isAuth } from "@/lib/helpers"
import { CompanyOperation } from "@/models/company-operation.model"
import { CompanyWallet } from "@/models/CompanyWallet.model"

import { ProfitDistribution } from "@/models/profit-distribution.model"
import { User } from "@/models/user.model"
import { ICompanyOperation } from "@/types/company-operation.type"
import { AnyBulkWriteOperation } from "mongoose"
import { NextRequest, NextResponse } from "next/server"


// Create new profit
export async function POST(req:NextRequest) {
    try {

        await connectDB()

        const authUser = await isAuth()
        if (!authUser || authUser?.userId === "") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        if ( authUser?.role !== "manager" && authUser?.role !== 'admin' ) {
            return NextResponse.json({ error: "Access Forbidden" }, { status: 403 })
        }

        const body = await req.json()
        const profit = await CompanyOperation.create({...body}) as unknown as ICompanyOperation ;
        if ( !profit ) {
            return NextResponse.json({ error: "Not created" }, { status: 401 })
        }


        // for compnay invest block
        if(body?.type !== 'loss'){
            await CompanyWallet.findOneAndUpdate({},{
                $inc: {
                    availableFund: body?.type === 'running' ? -profit?.amount : profit?.amount ,
                    investedFund: body?.type === 'running' ? profit?.amount : 0
               }
            },{new :true, runValidators:true})
        }
        

        // Share company profit or loss
        if(body?.distributed && body?.type !== 'running'){
           
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
                const userProfit = percent * body.amount;
                
                userOps.push({
                    updateOne:{
                        filter: {_id: user?._id },
                        update: {
                            $inc: {
                                profitEarned: profit?.type === 'profit' ?  userProfit: -userProfit ,
                                balance: profit?.type === 'profit' ?  userProfit: -userProfit 
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
            

             await CompanyWallet.findOneAndUpdate({},{
                $inc: {
                    availableFund: body?.type === 'loss' ? -profit?.amount : profit?.amount ,
               }
            },{new :true, runValidators:true})



        }

        return NextResponse.json(
            {
                 profit
            },
            { status: 201 },
        )

    } catch (error) {
        console.error("Profit error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}


// Get all profits for admin and manager 
export async function GET(req: NextRequest) {
  try {
    // Connect DB
    await connectDB()
    // Checked authentication
    const authUser = await isAuth()

    if (!authUser || authUser?.userId === "") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if ( authUser?.role !== "manager" && authUser?.role !== 'admin' ) {
        return NextResponse.json({ error: "Access Forbidden" }, { status: 403 })
    }
    

    const query = {}

    const profits = await CompanyOperation.find(query).populate({
      path:"createdBy",
      select: 'fullName phone email'
    }).lean()

    if (!profits) {
      return NextResponse.json({ error: "Profits not found" }, { status: 404 })
    }

    return NextResponse.json({ profits, message:'success' },{ status: 200 })
  } catch (error) {
    console.error("Get profits error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}