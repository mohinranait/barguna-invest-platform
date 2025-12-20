import { connectDB } from "@/lib/db"
import { isAuth } from "@/lib/helpers"
import { CompanyWallet } from "@/models/CompanyWallet.model"
import { Deposit } from "@/models/deposit.model"
import { Transaction } from "@/models/transaction.model"
import { User } from "@/models/user.model"
import { NextRequest, NextResponse } from "next/server"

// Update deposit request for admin approval
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {

        await connectDB()

        const depositId = params.id;
        const authUser = await isAuth()
        if (!authUser || authUser?.userId === "") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        if ( authUser?.role !== "manager" && authUser?.role !== 'admin' ) {
            return NextResponse.json({ error: "Access Forbidden" }, { status: 403 })
        }

        const body = await req.json()
        const deposit = await Deposit.findByIdAndUpdate(depositId,{...body, updatedBy: authUser?.userId },{new:true, runValidators:true})
        if ( !deposit ) {
            return NextResponse.json({ error: "not-found" }, { status: 404 })
        }

        
        
        if(body?.status === 'approved'){           
            // incress balance and invested amount in deposit created user
            const user = await User.findByIdAndUpdate(deposit?.createdBy , {
               $inc: {
                    balance: deposit?.amount,
                    investedAmount: deposit?.amount
               }
            },{new:true, runValidators:true});
            if ( !user ) {
                return NextResponse.json({ error: "not-found" }, { status: 404 })
            }

            await CompanyWallet.findOneAndUpdate({},{
                $inc: {
                    totalFund: deposit?.amount,
               }
            },{new:true, runValidators:true})

            // Create transaction
            await Transaction.create({
                createdBy: user?._id,
                amount: deposit?.amount,
                type: "deposit",
                referenceId: deposit?._id,
            })
        }
    
           
        return NextResponse.json( 
            {
                deposit
            },
            { status: 200 },
        )

    } catch (error) {
        console.error("Deposit error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

